import $ from "jquery";
import { googleSdkLoaded } from "vue3-google-login";
import { ref } from "vue";

const useGoogleLogin = async (ggClientId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID) => {
  const resultData = ref(null as any | null);
  const errorObject = ref(null as any | null);
  const initGoogle = async () => {
    googleSdkLoaded((google) => {
      // Request token to get authorization code
      google.accounts.oauth2
        .initCodeClient({
          client_id: ggClientId,
          scope: "email profile openid",
          callback: async (response: Record<string, any>) => {
            if (response.code) {
              const gCode: Record<string, any> = response.code;
              try {
                // Exchange code for token
                const googleData = await $.ajax({
                  url: `https://oauth2.googleapis.com/token`,
                  method: "POST",
                  dataType: "json",
                  data: {
                    code: gCode,
                    client_id: ggClientId,
                    client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
                    redirect_uri: "postmessage",
                    grant_type: "authorization_code",
                  },
                });
                // Use token to call Google API
                if (googleData) {
                  const accessToken = googleData.access_token;
                  const userObject = await $.ajax({
                    url: `https://www.googleapis.com/oauth2/v3/userinfo`,
                    method: "GET",
                    headers: { Authorization: `Bearer ${accessToken}` },
                  });
                  if (userObject && userObject.data) {
                    console.log(userObject.data);
                  } else {
                    console.log(userObject);
                  }
                }
              } catch (error: any) {
                console.error(error);
              }
            } else {
              errorObject.value = response;
            }
          },
        })
        .requestCode();
    });
  };
  await initGoogle();
  return { resultData, errorObject };
};

export default useGoogleLogin;
