window.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const detectedCharSpan = document.getElementById("detected-char");

  // Inisialisasi KNN Classifier dari ml5.js
  let knnClassifier;
  let modelLoaded = false;

  // Pastikan ml5 sudah tersedia
  if (typeof ml5 === "undefined") {
    console.error("❌ ml5.js tidak tersedia");
    return;
  }

  knnClassifier = ml5.KNNClassifier();

  // Load model JSON
  knnClassifier.load('assets/models/model_sibi.json', () => {
    console.log('✅ Model SIBI berhasil dimuat!');
    modelLoaded = true;
  });

  // Ubah landmarks ke array 1 dimensi
  function flattenLandmarks(landmarks) {
    return landmarks.flatMap(point => [point.x, point.y, point.z]);
  }

  // Resize canvas setelah video siap
  video.addEventListener("loadedmetadata", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  });

  // Inisialisasi MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => `assets/js/libs/${file}`,
});

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  hands.onResults(async (results) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
      drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 1 });

      const input = flattenLandmarks(landmarks);

      if (modelLoaded && knnClassifier.getNumLabels() > 0) {
        try {
          const result = await knnClassifier.classify(input);
          detectedCharSpan.innerText = result.label;
        } catch (error) {
          console.error("❌ Gagal klasifikasi:", error);
          detectedCharSpan.innerText = "-";
        }
      } else {
        detectedCharSpan.innerText = "-";
      }
    } else {
      detectedCharSpan.innerText = "-";
    }
  });

  // Inisialisasi Kamera
  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640,
    height: 480,
  });

  camera.start();

  // Tambahkan ini setelah camera.start()
navigator.permissions.query({ name: 'camera' }).then(permissionStatus => {
  if (permissionStatus.state === 'denied') {
    alert('Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.');
  }
  permissionStatus.onchange = () => {
    console.log('Status izin kamera berubah:', permissionStatus.state);
  };
});

  // Tambah data manual via keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key.match(/[a-z]/i)) {
      const currentLandmarks = hands.lastResults?.multiHandLandmarks?.[0];
      if (currentLandmarks) {
        const input = flattenLandmarks(currentLandmarks);
        knnClassifier.addExample(input, e.key.toUpperCase());
        console.log(`📌 Ditambahkan sample huruf "${e.key.toUpperCase()}"`);
      }
    }
  });
});
