// utils/colorGenerator.js

// 🔽 Fungsi random pastel
const randomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360) // 0–360 derajat warna
  const saturation = 70 + Math.random() * 10  // 70–80% biar soft
  const lightness = 70 + Math.random() * 10   // 70–80% biar pastel

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// 🔽 Generator warna sesuai jumlah data
export const getColors = (jumlah) => {
  const colors = []
  for (let i = 0; i < jumlah; i++) {
    colors.push(randomPastelColor())
  }
  return colors
}
