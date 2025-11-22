import apiFetch from "./fetchClient";

const loginAuth = async (email: string, password: string) => {
  try {
    const data = await apiFetch("api/token/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default loginAuth;
