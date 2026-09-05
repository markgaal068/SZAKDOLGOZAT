// Böngészőben futó kép-átméretezés/tömörítés, mielőtt base64-ként elmentenénk
// a MongoDB dokumentumba. Enélkül egy telefonnal készült fotó simán 3-8 MB is
// lehet, ami base64-be kódolva gyorsan szétfeszíti a hír-dokumentumokat és a
// betöltési sebességet is rontja.
export function fileToCompressedDataUrl(file, { maxDimension = 1600, quality = 0.82 } = {}) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDimension || height > maxDimension) {
                    const scale = maxDimension / Math.max(width, height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}
