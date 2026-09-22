$ErrorActionPreference = "Stop"

$expectedBranch = "waveshare-performance-fix"
$currentBranch = (git branch --show-current).Trim()

if ($currentBranch -ne $expectedBranch) {
    throw "STOP: current branch is '$currentBranch'. Switch to '$expectedBranch' first."
}

function Read-Normalized([string]$Path) {
    $text = [System.IO.File]::ReadAllText($Path)
    return $text.Replace("`r`n", "`n")
}

function Write-Utf8Lf([string]$Path, [string]$Content) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content.Replace("`r`n", "`n"), $utf8NoBom)
}

function Replace-Exact([string]$Path, [string]$Old, [string]$New, [string]$Label) {
    $content = Read-Normalized $Path
    $oldNorm = $Old.Replace("`r`n", "`n")
    $newNorm = $New.Replace("`r`n", "`n")

    if (-not $content.Contains($oldNorm)) {
        throw "STOP: expected block not found in $Path ($Label). No partial patch committed."
    }

    $content = $content.Replace($oldNorm, $newNorm)
    Write-Utf8Lf $Path $content
    Write-Host "OK  $Path  [$Label]"
}

Write-Host ""
Write-Host "=== RTC Waveshare frontend performance patch - Phase 1 ==="
Write-Host "Branch: $currentBranch"
Write-Host ""

# --------------------------------------------------------------------------
# 1) App.js
# Remove unused drawer exports that already produce webpack warnings.
# No navigation behavior is changed.
# --------------------------------------------------------------------------
Replace-Exact "App.js" @'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
'@ @'
import { createDrawerNavigator } from '@react-navigation/drawer';
'@ "remove unused drawer imports"

# --------------------------------------------------------------------------
# 2) Stats.js
# Coalesce high-frequency position socket traffic to a 20 Hz DISPLAY rate.
# Machine/backend/EtherCAT rates are untouched.
# --------------------------------------------------------------------------
Replace-Exact "src/components/Stats.js" @'
    const [pos, setPos] = React.useState('');
    const [dest, setDest] = React.useState('');
    const [driveError, setDriveError] = React.useState('0');

    const dispatch = useDispatch();
'@ @'
    /*
     * HMI DISPLAY STATE ONLY.
     *
     * The backend may publish position data much faster than a human-readable
     * screen needs. Keep the newest socket values in refs, then paint them at
     * 20 Hz. EtherCAT, motion control, alarms and commands are NOT throttled.
     */
    const [positionDisplay, setPositionDisplay] = React.useState({
        pos: '',
        dest: ''
    });
    const [driveError, setDriveError] = React.useState('0');

    const latestPosRef = useRef('');
    const latestDestRef = useRef('');

    const dispatch = useDispatch();
'@ "add coalesced position display state"

Replace-Exact "src/components/Stats.js" @'
    const handlePos = useCallback(data => setPos(data.data), []);
    const handleDest = useCallback(data => setDest(data.pos), []);
'@ @'
    const handlePos = useCallback(data => {
        if (data && data.data !== undefined) {
            latestPosRef.current = data.data;
        }
    }, []);

    const handleDest = useCallback(data => {
        if (data && data.pos !== undefined) {
            latestDestRef.current = data.pos;
        }
    }, []);
'@ "stop rendering on every position packet"

Replace-Exact "src/components/Stats.js" @'
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setError(false);
                setStatus(false);
            };
        }, [])
    );

    useEffect(() => {
'@ @'
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setError(false);
                setStatus(false);
            };
        }, [])
    );

    /*
     * Visual telemetry refresh: 20 Hz.
     *
     * This is deliberately independent from the control/PDO rate.
     * Emergency, Reset, alarms, JOG START/STOP and all machine commands keep
     * their existing immediate event path.
     */
    useEffect(() => {
        const displayTimer = setInterval(() => {
            const nextPos = latestPosRef.current;
            const nextDest = latestDestRef.current;

            setPositionDisplay(current => {
                if (
                    current.pos === nextPos &&
                    current.dest === nextDest
                ) {
                    return current;
                }

                return {
                    pos: nextPos,
                    dest: nextDest
                };
            });
        }, 50);

        return () => {
            clearInterval(displayTimer);
        };
    }, []);

    useEffect(() => {
'@ "add 20 Hz display flush"

Replace-Exact "src/components/Stats.js" @'
                                    {dest}
'@ @'
                                    {positionDisplay.dest}
'@ "bind actual-position display to coalesced state"

Replace-Exact "src/components/Stats.js" @'
                                    {pos}
'@ @'
                                    {positionDisplay.pos}
'@ "bind destination display to coalesced state"

Replace-Exact "src/components/Stats.js" @'
export default Stats;
'@ @'
export default React.memo(Stats);
'@ "memoize Stats against parent-only rerenders"

# --------------------------------------------------------------------------
# 3) HomeStatusPanel.js
# Same 20 Hz display coalescing for the home dashboard.
# --------------------------------------------------------------------------
Replace-Exact "src/components/panels/HomeStatusPanel.js" @'
  useEffect,
  useState
'@ @'
  useEffect,
  useRef,
  useState
'@ "import useRef"

Replace-Exact "src/components/panels/HomeStatusPanel.js" @'
  const [
    actualPosition,
    setActualPosition
  ] =
    useState(
      ''
    );


  const [
    destination,
    setDestination
  ] =
    useState(
      ''
    );
'@ @'
  /*
   * Display-only position state.
   * Incoming position packets are coalesced before repainting the dashboard.
   */
  const [
    positionDisplay,
    setPositionDisplay
  ] =
    useState({
      actualPosition:
        '',

      destination:
        ''
    });


  const actualPosition =
    positionDisplay.actualPosition;


  const destination =
    positionDisplay.destination;


  const latestActualPositionRef =
    useRef(
      ''
    );


  const latestDestinationRef =
    useRef(
      ''
    );
'@ "replace per-packet position states"

Replace-Exact "src/components/panels/HomeStatusPanel.js" @'
          setDestination(
            formatPosition(
              data.data
            )
          );
'@ @'
          latestDestinationRef.current =
            formatPosition(
              data.data
            );
'@ "buffer pos_data instead of immediate render"

Replace-Exact "src/components/panels/HomeStatusPanel.js" @'
          setActualPosition(
            formatPosition(
              data.pos
            )
          );
'@ @'
          latestActualPositionRef.current =
            formatPosition(
              data.pos
            );
'@ "buffer destination_position instead of immediate render"

Replace-Exact "src/components/panels/HomeStatusPanel.js" @'
  useEffect(
    () => {

      socket.on(
'@ @'
  /*
   * Paint position telemetry at 20 Hz maximum.
   * Control/event traffic remains immediate.
   */
  useEffect(
    () => {

      const displayTimer =
        setInterval(
          () => {

            const nextActualPosition =
              latestActualPositionRef.current;


            const nextDestination =
              latestDestinationRef.current;


            setPositionDisplay(
              current => {

                if (
                  current.actualPosition === nextActualPosition &&
                  current.destination === nextDestination
                ) {

                  return current;
                }


                return {
                  actualPosition:
                    nextActualPosition,

                  destination:
                    nextDestination
                };
              }
            );
          },
          50
        );


      return () => {

        clearInterval(
          displayTimer
        );
      };
    },
    []
  );


  useEffect(
    () => {

      socket.on(
'@ "add 20 Hz home display flush"

Replace-Exact "src/components/panels/HomeStatusPanel.js" @'
export default HomeStatusPanel;
'@ @'
export default React.memo(HomeStatusPanel);
'@ "memoize HomeStatusPanel"

# --------------------------------------------------------------------------
# 4) Manual.js
# Give JogSpeedometer a stable onChange callback and remove a 20 Hz console
# spam path during dragging.
# --------------------------------------------------------------------------
Replace-Exact "src/screens/manual/Manual.js" @'
      console.log(
        '[MANUAL-JOG-SYNC] received jog_feed=',
        value
      );

'@ @'
'@ "remove repeated jog-feed console logging"

Replace-Exact "src/screens/manual/Manual.js" @'
  }, [socket]);

  useEffect(() => {
    return () => {
'@ @'
  }, [socket]);

  /*
   * Stable callback prevents unrelated Manual-screen state changes from
   * invalidating a memoized JogSpeedometer.
   */
  const handleJogFeedChange = useCallback((newJogFeed) => {
    const safeJogFeed =
      Number(
        Number(newJogFeed).toFixed(6)
      );

    if (
      Number.isNaN(safeJogFeed) ||
      safeJogFeed < 0 ||
      safeJogFeed > 20
    ) {
      return;
    }

    setJogFeed(currentJogFeed => {
      if (currentJogFeed === safeJogFeed) {
        return currentJogFeed;
      }

      return safeJogFeed;
    });

    /*
     * Existing backend mirror behavior is retained.
     * emitJogFeedMirror already rate-limits outbound packets.
     */
    emitJogFeedMirror(safeJogFeed);
  }, [emitJogFeedMirror]);

  useEffect(() => {
    return () => {
'@ "add stable speedometer change callback"

Replace-Exact "src/screens/manual/Manual.js" @'
                    onChange={(newJogFeed) => {
                      const safeJogFeed =
                        Number(
                          Number(newJogFeed).toFixed(6)
                        );

                      if (
                        !Number.isNaN(safeJogFeed) &&
                        safeJogFeed >= 0 &&
                        safeJogFeed <= 20
                      ) {
                        /*
                         * Update this UI immediately.
                         */
                        setJogFeed(currentJogFeed => {
                          if (currentJogFeed === safeJogFeed) {
                            return currentJogFeed;
                          }

                          return safeJogFeed;
                        });

                        /*
                         * Mirror only the selected speed value to all
                         * connected Manual screens through the backend.
                         * Outbound mirror packets are throttled during drag
                         * to reduce UI/socket load; the final value is kept.
                         */
                        emitJogFeedMirror(safeJogFeed);
                      }
                    }}
'@ @'
                    onChange={handleJogFeedChange}
'@ "replace inline speedometer callback"

# --------------------------------------------------------------------------
# 5) JogSpeedometer.js
# Ignore responder events that quantize to the same 0.2 feed point and memoize
# the component for unrelated parent renders.
# --------------------------------------------------------------------------
Replace-Exact "src/screens/manual/JogSpeedometer.js" @'
    const next =
      clamp(
        newValue
      );


    latestValueRef.current =
      next;
'@ @'
    const next =
      clamp(
        newValue
      );


    /*
     * Touchscreens can produce many move events while the finger is still
     * inside the same quantized feed point. Do not repaint/re-emit unless
     * the selected point actually changed.
     */
    if (
      next ===
      latestValueRef.current
    ) {

      return;
    }


    latestValueRef.current =
      next;
'@ "dedupe same-point touch events"

Replace-Exact "src/screens/manual/JogSpeedometer.js" @'
export default JogSpeedometer;
'@ @'
export default React.memo(JogSpeedometer);
'@ "memoize JogSpeedometer"

Write-Host ""
Write-Host "=== Patch applied. Validation ==="

git diff --check
if ($LASTEXITCODE -ne 0) {
    throw "git diff --check failed"
}

git status --short
git diff --stat

Write-Host ""
Write-Host "Next:"
Write-Host "  1. npm/expo web build"
Write-Host "  2. test Home idle / Manual idle / speedometer"
Write-Host "  3. DO NOT commit until runtime test is satisfactory"
