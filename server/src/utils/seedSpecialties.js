const { Specialty } = require('../models');

const medicalSpecialties = [
  // Medicina Interna y afines
  { name: 'Alergología e Inmunología', description: 'Diagnóstico y tratamiento de alergias y trastornos del sistema inmunológico' },
  { name: 'Cardiología', description: 'Estudio y tratamiento de enfermedades del corazón y sistema cardiovascular' },
  { name: 'Endocrinología', description: 'Tratamiento de trastornos hormonales y metabólicos' },
  { name: 'Gastroenterología', description: 'Diagnóstico y tratamiento de enfermedades del sistema digestivo' },
  { name: 'Geriatría', description: 'Atención médica especializada para adultos mayores' },
  { name: 'Hematología', description: 'Estudio y tratamiento de enfermedades de la sangre' },
  { name: 'Infectología', description: 'Diagnóstico y tratamiento de enfermedades infecciosas' },
  { name: 'Medicina Interna', description: 'Atención integral de adultos con enfermedades complejas' },
  { name: 'Nefrología', description: 'Tratamiento de enfermedades renales' },
  { name: 'Neumología', description: 'Diagnóstico y tratamiento de enfermedades respiratorias' },
  { name: 'Oncología Médica', description: 'Tratamiento del cáncer mediante quimioterapia y terapias sistémicas' },
  { name: 'Reumatología', description: 'Tratamiento de enfermedades articulares y autoinmunes' },

  // Especialidades Quirúrgicas
  { name: 'Cirugía General', description: 'Procedimientos quirúrgicos del abdomen y tejidos blandos' },
  { name: 'Cirugía Cardiovascular', description: 'Cirugía del corazón y grandes vasos' },
  { name: 'Cirugía Torácica', description: 'Cirugía de órganos torácicos excepto el corazón' },
  { name: 'Cirugía Vascular', description: 'Tratamiento quirúrgico de enfermedades vasculares' },
  { name: 'Coloproctología', description: 'Cirugía del colon, recto y ano' },
  { name: 'Neurocirugía', description: 'Cirugía del sistema nervioso central y periférico' },
  { name: 'Oftalmología', description: 'Diagnóstico y tratamiento de enfermedades oculares' },
  { name: 'Ortopedia y Traumatología', description: 'Tratamiento de lesiones y enfermedades del sistema musculoesquelético' },
  { name: 'Otorrinolaringología', description: 'Tratamiento de oído, nariz, garganta y cirugía de cabeza y cuello' },
  { name: 'Cirugía Plástica y Reconstructiva', description: 'Cirugía estética y reparadora' },
  { name: 'Urología', description: 'Tratamiento de enfermedades del sistema urinario y reproductor masculino' },

  // Especialidades Diagnósticas
  { name: 'Anatomía Patológica', description: 'Diagnóstico de enfermedades mediante análisis de tejidos' },
  { name: 'Radiología', description: 'Diagnóstico por imágenes médicas' },
  { name: 'Medicina Nuclear', description: 'Uso de radiofármacos para diagnóstico y tratamiento' },
  { name: 'Genética Médica', description: 'Diagnóstico y asesoramiento de enfermedades genéticas' },

  // Otras Especialidades
  { name: 'Anestesiología', description: 'Manejo del dolor y anestesia quirúrgica' },
  { name: 'Medicina de Emergencias', description: 'Atención de urgencias y emergencias médicas' },
  { name: 'Medicina Familiar', description: 'Atención integral de la familia en todos los grupos de edad' },
  { name: 'Medicina Intensiva', description: 'Cuidados críticos de pacientes graves' },
  { name: 'Neurología', description: 'Diagnóstico y tratamiento de enfermedades del sistema nervioso' },
  { name: 'Ginecología y Obstetricia', description: 'Salud reproductiva femenina y atención del embarazo' },
  { name: 'Medicina del Trabajo', description: 'Prevención y tratamiento de enfermedades ocupacionales' },
  { name: 'Pediatría', description: 'Atención médica de niños y adolescentes' },
  { name: 'Neonatología', description: 'Cuidados médicos de recién nacidos' },
  { name: 'Medicina Física y Rehabilitación', description: 'Recuperación funcional y tratamiento del dolor' },
  { name: 'Psiquiatría', description: 'Diagnóstico y tratamiento de trastornos mentales' },
  { name: 'Salud Pública', description: 'Prevención de enfermedades y promoción de la salud poblacional' },
  { name: 'Radioterapia', description: 'Tratamiento del cáncer mediante radiación' },
  { name: 'Medicina del Deporte', description: 'Prevención y tratamiento de lesiones deportivas' },
  { name: 'Medicina Paliativa', description: 'Cuidados de confort para enfermedades terminales' },
  { name: 'Dermatología', description: 'Diagnóstico y tratamiento de enfermedades de la piel' },
  { name: 'Medicina del Dolor', description: 'Manejo especializado del dolor crónico' },
  { name: 'Medicina del Sueño', description: 'Diagnóstico y tratamiento de trastornos del sueño' },
  
  // Subespecialidades Pediátricas
  { name: 'Cardiología Pediátrica', description: 'Enfermedades cardíacas en niños' },
  { name: 'Endocrinología Pediátrica', description: 'Trastornos hormonales en niños' },
  { name: 'Gastroenterología Pediátrica', description: 'Enfermedades digestivas en niños' },
  { name: 'Nefrología Pediátrica', description: 'Enfermedades renales en niños' },
  { name: 'Oncología Pediátrica', description: 'Tratamiento del cáncer infantil' },
  { name: 'Cirugía Pediátrica', description: 'Procedimientos quirúrgicos en niños' },
];

async function seedSpecialties() {
  try {
    console.log('🏥 Iniciando carga de especialidades médicas...');
    
    let created = 0;
    let existing = 0;

    for (const specialty of medicalSpecialties) {
      const [spec, wasCreated] = await Specialty.findOrCreate({
        where: { name: specialty.name },
        defaults: specialty
      });

      if (wasCreated) {
        created++;
        console.log(`✅ Creada: ${specialty.name}`);
      } else {
        existing++;
        console.log(`ℹ️  Ya existe: ${specialty.name}`);
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   ✅ Especialidades creadas: ${created}`);
    console.log(`   ℹ️  Especialidades existentes: ${existing}`);
    console.log(`   📋 Total en base de datos: ${medicalSpecialties.length}`);
    console.log('\n🎉 ¡Proceso completado exitosamente!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cargar especialidades:', error);
    process.exit(1);
  }
}

seedSpecialties();
