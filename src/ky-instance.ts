import { notifications } from "@mantine/notifications";
import ky from "ky";

export const kyInstance = ky.extend({
  hooks: {
    beforeRequest: [],
    afterResponse: [],
    beforeError: [
      (error) => {
        notifications.show({ title: "Error", message: error.message });
        return error;
      },
    ],
  },
});

// axiosInstance.interceptors.request.use(
//   (request) => {
//     //TODO: Check auth status here and redirect to login if not authenticated.

//     //TODO: Check if request.url starts with a known API url and set appropriate auth headers

//     return request;
//   },
//   (error) => {
//     console.error(error);

//     notifications.show({
//       title: "Error",
//       message: error,
//     });

//     return Promise.reject(error);
//   },
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   (error) => {
//     notifications.show({
//       title: "Error",
//       message: error,
//     });

//     return Promise.reject(error);
//   },
// );
