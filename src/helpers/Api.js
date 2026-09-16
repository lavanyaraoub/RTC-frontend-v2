import {
  Alert,
} from 'react-native';

const uri = window.location.host.split(':')[0];
//const uri = '192.168.1.100';

const api = {

  getJSON(args) {

    args = args.trim();
    var url = `http://` + uri + `:5000/` + args;
    console.log(url);
    return fetch(encodeURI(url)).then((res) => res.json());
  },

  postJSON(args, data) {
    args = args.trim();
    var url = `http://` + uri + `:5000/` + args;
    return fetch(encodeURI(url), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((res) => {
      console.log(res);
      return res.json();
    });
  },

  resetJSON(args, data) {
    args = args.trim();
    var url = `http://` + uri + `:5000/` + args;
    return fetch(encodeURI(url), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((res) => res.json());
  },

  postAuthJSON(args, data, token) {
    args = args.trim();
    var url = `http://` + uri + `:5000/` + args;
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(data)
    }).then((res) => {
      console.log(res);
      if (res.status == 401) {
        return { status: 401 };
      }
      else if ((res.status == 200) || res.status == 400) {
        return res.json();
      }
    })
      .catch((e) => {
        Alert.alert(
          'Network error',
          'Please check your internet connection',
          [
            { text: 'Close', onPress: () => console.log('Cancel'), style: 'cancel' },
          ],
          { cancelable: true }
        );
      });
  },
}

export default api;