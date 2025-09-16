const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function createRoundedIcon() {
  try {
    // Cargar la imagen original
    const iconPath = path.join(__dirname, 'public', 'icono.png');
    const image = await loadImage(iconPath);
    
    // Crear canvas optimizado para el tamaño del Dock del usuario (54px)
    // Usar múltiplo para mejor calidad en pantallas Retina
    const dockSize = 54;
    const size = dockSize * 4; // 216px para mejor calidad
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Configurar el radio de los bordes redondeados optimizado para 54px
    const cornerRadius = size * 0.185; // Ajustado para verse mejor en tamaño pequeño
    
    // Crear la máscara con bordes redondeados
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, cornerRadius);
    ctx.clip();
    
    // Dibujar la imagen original escalada
    ctx.drawImage(image, 0, 0, size, size);
    
    // Guardar la imagen redondeada
    const outputPath = path.join(__dirname, 'public', 'icono-rounded.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ Icono redondeado creado en:', outputPath, `(optimizado para Dock de ${dockSize}px)`);
    
    // Crear iconset para .icns con mapeo correcto de tamaños
    const iconsetDir = path.join(__dirname, 'public', 'icono.iconset');
    
    if (!fs.existsSync(iconsetDir)) {
      fs.mkdirSync(iconsetDir);
    }
    
    // Mapeo correcto para iconset de macOS
    const iconSizes = [
      { size: 16, files: ['icon_16x16.png'] },
      { size: 32, files: ['icon_16x16@2x.png', 'icon_32x32.png'] },
      { size: 64, files: ['icon_32x32@2x.png'] },
      { size: 128, files: ['icon_128x128.png'] },
      { size: 256, files: ['icon_128x128@2x.png', 'icon_256x256.png'] },
      { size: 512, files: ['icon_256x256@2x.png', 'icon_512x512.png'] },
      { size: 1024, files: ['icon_512x512@2x.png'] }
    ];
    
    for (const { size: iconSize, files } of iconSizes) {
      const iconCanvas = createCanvas(iconSize, iconSize);
      const iconCtx = iconCanvas.getContext('2d');
      const iconCornerRadius = iconSize <= 64 ? iconSize * 0.185 : iconSize * 0.225;
      
      iconCtx.beginPath();
      iconCtx.roundRect(0, 0, iconSize, iconSize, iconCornerRadius);
      iconCtx.clip();
      iconCtx.drawImage(image, 0, 0, iconSize, iconSize);
      
      const iconBuffer = iconCanvas.toBuffer('image/png');
      
      // Escribir todos los archivos necesarios para este tamaño
      for (const filename of files) {
        fs.writeFileSync(path.join(iconsetDir, filename), iconBuffer);
      }
    }
    
    console.log('✅ Iconset creado en:', iconsetDir);
    console.log('Ahora ejecuta: iconutil -c icns public/icono.iconset');
    
  } catch (error) {
    console.error('❌ Error creando icono redondeado:', error);
  }
}

createRoundedIcon();
