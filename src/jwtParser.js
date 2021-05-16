import jwtDecode from "jwt-decode";

export default {
  parse: (token) => {
    if (!token) {
      return null;
    }

    try {
      return jwtDecode(token);
    } catch (err) {
      return null;
    }
  },
};
