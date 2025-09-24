-- Crear la tabla profiles
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad (permite acceso completo por ahora)
-- En producción, deberías restringir esto según tus necesidades de autenticación
CREATE POLICY "Allow all operations on profiles" ON profiles
    FOR ALL USING (true) WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE profiles IS 'Tabla para almacenar perfiles de trabajo con sus aplicaciones y URLs asociadas';
COMMENT ON COLUMN profiles.id IS 'Identificador único del perfil (UUID)';
COMMENT ON COLUMN profiles.name IS 'Nombre descriptivo del perfil';
COMMENT ON COLUMN profiles.icon IS 'Nombre del icono de Lucide React (opcional)';
COMMENT ON COLUMN profiles.items IS 'Array JSON de elementos (apps y URLs) del perfil';
COMMENT ON COLUMN profiles.created_at IS 'Fecha y hora de creación del perfil';
COMMENT ON COLUMN profiles.updated_at IS 'Fecha y hora de última actualización del perfil';
