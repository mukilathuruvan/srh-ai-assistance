// const API_URL = "https://valid-tuner-443610-s1.ew.r.appspot.com/api";

const API_URL = "http://localhost:8080/api";

export const chatWithBot = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return "Sorry, I don't understand. Please try again.";
  }
};

export const convertToAudio = async (text, language) => {
  try {
    const response = await fetch(`${API_URL}/speak`, {
      method: "POST",
      body: JSON.stringify({ text, language }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const processVideo = async (videoUrl) => {
  try {
    const response = await fetch(`${API_URL}/video`, {
      method: "POST",
      body: JSON.stringify({ videoUrl }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
