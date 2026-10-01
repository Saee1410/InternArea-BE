import axios from "axios";
import { translate } from "google-translate-api-x";

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || "http://127.0.0.1:5000";
const SUPPORTED_LANGUAGES = ["hi", "pt", "es", "fr", "zh"];

export const translateText = async (text, targetLanguage) => {
    if (
        !text ||
        (Array.isArray(text) && text.length === 0) ||
        !targetLanguage ||
        targetLanguage === "en" ||
        !SUPPORTED_LANGUAGES.includes(targetLanguage)
    ) {
        return text;
    }

    try {
        // 🟢 १. आधी लोकल Docker (LibreTranslate) ट्राय करा
        const response = await axios.post(
            `${LIBRETRANSLATE_URL}/translate`,
            {
                q: text,
                source: "en",
                target: targetLanguage,
                format: "text"
            },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 3000 // फक्त ३ सेकंद वाट पाहा
            }
        );

        if (Array.isArray(response.data)) {
            return response.data.map((item) => item.translatedText || item);
        }
        if (response.data && response.data.translatedText) {
            return response.data.translatedText;
        }

        return text;
    } catch (dockerError) {
        // 🟡 २. जर Docker बंद असेल किंवा एरर आली, तर Google Translate वापरा
        try {
            if (Array.isArray(text)) {
                // अ‍ॅरे ट्रान्सलेट करण्यासाठी
                const res = await translate(text, { to: targetLanguage });
                return res.map((item) => item.text);
            } else {
                // सिंगल स्ट्रिंग ट्रान्सलेट करण्यासाठी
                const res = await translate(text, { to: targetLanguage });
                return res.text;
            }
        } catch (googleError) {
            console.error(`Google Translation Error [${targetLanguage}]:`, googleError.message);
            return text; // दोन्ही फेल झाले तर ओरिजिनल डेटा पाठवा
        }
    }
};
