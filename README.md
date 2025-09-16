# ProfileHub

Una aplicación de escritorio moderna para gestionar perfiles de trabajo con URLs y aplicaciones. Construida con Next.js y Electron.

## ✨ Características

- **Gestión de Perfiles**: Crea y organiza diferentes perfiles de trabajo
- **Lanzamiento Rápido**: Abre perfiles completos con todas las apps y URLs de una vez
- **Selección Inteligente de Apps**: Navega y selecciona aplicaciones usando la integración nativa del Finder
- **Interfaz Moderna**: Interfaz limpia y responsiva con soporte para tema oscuro/claro
- **Experiencia Nativa**: App de escritorio con icono redondeado personalizado optimizado para el Dock de macOS

## 🚀 Comenzar

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev:electron
```

### Construcción

```bash
# Construir app de Electron
npm run build:electron

# Construir app de Next.js
npm run build
```

## 🛠 Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Escritorio**: Electron
- **Componentes UI**: Radix UI, Tailwind CSS
- **Iconos**: Lucide React

## 📱 Uso

1. Crea perfiles de trabajo para diferentes contextos (Desarrollo, Trading, etc.)
2. Añade URLs y aplicaciones a cada perfil
3. Usa el botón "Buscar" para seleccionar apps a través del Finder
4. Lanza perfiles completos con un solo clic
5. Los elementos individuales pueden probarse antes de añadirlos a los perfiles

## 🎨 Generación de Iconos

La app incluye un script personalizado de generación de iconos que crea iconos redondeados optimizados para macOS:

```bash
# Generar icono redondeado
node create_rounded_icon.js
```

Esto crea iconos del tamaño adecuado con esquinas redondeadas estilo macOS para el Dock.


INICIAR PROGRAMA
npm run dev:electron