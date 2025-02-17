const API_URL = "https://valid-tuner-443610-s1.ew.r.appspot.com/api";

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