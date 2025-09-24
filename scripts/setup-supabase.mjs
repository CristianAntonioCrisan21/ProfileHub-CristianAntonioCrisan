#!/usr/bin/env node

/**
 * Script de configuración automática para Supabase en ProfileHub
 * 
 * Este script ayuda a configurar Supabase en tu proyecto ProfileHub.
 * Ejecuta: npm run setup:supabase
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🚀 Configuración de Supabase para ProfileHub\n');
  
  // Verificar si ya existe .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    console.log('⚠️  El archivo .env.local ya existe.');
    const overwrite = await question('¿Deseas sobrescribirlo? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Configuración cancelada.');
      rl.close();
      return;
    }
  }
  
  console.log('\n📋 Necesitamos algunos datos de tu proyecto Supabase:');
  console.log('   Puedes encontrarlos en: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api\n');
  
  const supabaseUrl = await question('🔗 URL de tu proyecto Supabase: ');
  const supabaseKey = await question('🔑 Clave anónima (anon/public): ');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ URL y clave son requeridos.');
    rl.close();
    return;
  }
  
  // Crear contenido del .env.local
  const envContent = `# Configuración de Supabase para ProfileHub
# Generado automáticamente el ${new Date().toISOString()}

# URL de tu proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}

# Clave pública anónima de Supabase (segura para el frontend)
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}

# Nota: Nunca subas este archivo a Git. Ya está incluido en .gitignore.
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Archivo .env.local creado exitosamente!');
  } catch (error) {
    console.log('\n❌ Error al crear .env.local:', error.message);
    rl.close();
    return;
  }
  
  console.log('\n📊 Próximos pasos:');
  console.log('1. Ve a tu dashboard de Supabase');
  console.log('2. Navega al SQL Editor');
  console.log('3. Ejecuta el contenido del archivo: supabase/migrations/001_create_profiles_table.sql');
  console.log('4. Reinicia tu servidor de desarrollo: npm run dev');
  console.log('\n🎉 ¡Tu aplicación estará lista para usar Supabase!');
  
  const openDocs = await question('\n📖 ¿Deseas abrir la documentación completa? (y/N): ');
  if (openDocs.toLowerCase() === 'y' || openDocs.toLowerCase() === 'yes') {
    const docsPath = path.join(process.cwd(), 'SUPABASE_SETUP.md');
    if (fs.existsSync(docsPath)) {
      console.log(`📄 Documentación disponible en: ${docsPath}`);
    }
  }
  
  rl.close();
}

main().catch(console.error);
