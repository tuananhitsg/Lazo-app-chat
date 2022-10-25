import axiosClient from './axiosClient';

const loginApi = {
    login: (email, password) => {
        const url = '/auth/login';
        return axiosClient.post(url, { email, password });
    },
    registry:async (name, email, password) => {
        const url = '/auth/register';

        return axiosClient.post(url, { name, email, password });
    },

    forgot: (email) => {
        const url = '/auth/get-otp';
        return axiosClient.post(url, { email });
    },
    confirmAccount: (email, otp) => {
        const url = '/auth/verify-account';
        return axiosClient.post(url, { email, otp });
    },
    confirmPassword: (username, otp, password) => {
        const url = '/auth/reset-password';
        return axiosClient.post(url, { username, otp, password });
    },
    fetchUser: (email) => {
        const url = `/auth/users/${email}`;
        return axiosClient.get(url);
    },
};

export default loginApi;
