# Especialidades Médicas - Medicus

Este documento lista todas las especialidades médicas disponibles en el sistema Medicus.

## Total de Especialidades: 51

### Medicina Interna y Afines (12)

1. **Alergología e Inmunología** - Diagnóstico y tratamiento de alergias y trastornos del sistema inmunológico
2. **Cardiología** - Estudio y tratamiento de enfermedades del corazón y sistema cardiovascular
3. **Endocrinología** - Tratamiento de trastornos hormonales y metabólicos
4. **Gastroenterología** - Diagnóstico y tratamiento de enfermedades del sistema digestivo
5. **Geriatría** - Atención médica especializada para adultos mayores
6. **Hematología** - Estudio y tratamiento de enfermedades de la sangre
7. **Infectología** - Diagnóstico y tratamiento de enfermedades infecciosas
8. **Medicina Interna** - Atención integral de adultos con enfermedades complejas
9. **Nefrología** - Tratamiento de enfermedades renales
10. **Neumología** - Diagnóstico y tratamiento de enfermedades respiratorias
11. **Oncología Médica** - Tratamiento del cáncer mediante quimioterapia y terapias sistémicas
12. **Reumatología** - Tratamiento de enfermedades articulares y autoinmunes

### Especialidades Quirúrgicas (11)

13. **Cirugía General** - Procedimientos quirúrgicos del abdomen y tejidos blandos
14. **Cirugía Cardiovascular** - Cirugía del corazón y grandes vasos
15. **Cirugía Torácica** - Cirugía de órganos torácicos excepto el corazón
16. **Cirugía Vascular** - Tratamiento quirúrgico de enfermedades vasculares
17. **Coloproctología** - Cirugía del colon, recto y ano
18. **Neurocirugía** - Cirugía del sistema nervioso central y periférico
19. **Oftalmología** - Diagnóstico y tratamiento de enfermedades oculares
20. **Ortopedia y Traumatología** - Tratamiento de lesiones y enfermedades del sistema musculoesquelético
21. **Otorrinolaringología** - Tratamiento de oído, nariz, garganta y cirugía de cabeza y cuello
22. **Cirugía Plástica y Reconstructiva** - Cirugía estética y reparadora
23. **Urología** - Tratamiento de enfermedades del sistema urinario y reproductor masculino

### Especialidades Diagnósticas (4)

24. **Anatomía Patológica** - Diagnóstico de enfermedades mediante análisis de tejidos
25. **Radiología** - Diagnóstico por imágenes médicas
26. **Medicina Nuclear** - Uso de radiofármacos para diagnóstico y tratamiento
27. **Genética Médica** - Diagnóstico y asesoramiento de enfermedades genéticas

### Otras Especialidades (18)

28. **Anestesiología** - Manejo del dolor y anestesia quirúrgica
29. **Medicina de Emergencias** - Atención de urgencias y emergencias médicas
30. **Medicina Familiar** - Atención integral de la familia en todos los grupos de edad
31. **Medicina Intensiva** - Cuidados críticos de pacientes graves
32. **Neurología** - Diagnóstico y tratamiento de enfermedades del sistema nervioso
33. **Ginecología y Obstetricia** - Salud reproductiva femenina y atención del embarazo
34. **Medicina del Trabajo** - Prevención y tratamiento de enfermedades ocupacionales
35. **Pediatría** - Atención médica de niños y adolescentes
36. **Neonatología** - Cuidados médicos de recién nacidos
37. **Medicina Física y Rehabilitación** - Recuperación funcional y tratamiento del dolor
38. **Psiquiatría** - Diagnóstico y tratamiento de trastornos mentales
39. **Salud Pública** - Prevención de enfermedades y promoción de la salud poblacional
40. **Radioterapia** - Tratamiento del cáncer mediante radiación
41. **Medicina del Deporte** - Prevención y tratamiento de lesiones deportivas
42. **Medicina Paliativa** - Cuidados de confort para enfermedades terminales
43. **Dermatología** - Diagnóstico y tratamiento de enfermedades de la piel
44. **Medicina del Dolor** - Manejo especializado del dolor crónico
45. **Medicina del Sueño** - Diagnóstico y tratamiento de trastornos del sueño

### Subespecialidades Pediátricas (6)

46. **Cardiología Pediátrica** - Enfermedades cardíacas en niños
47. **Endocrinología Pediátrica** - Trastornos hormonales en niños
48. **Gastroenterología Pediátrica** - Enfermedades digestivas en niños
49. **Nefrología Pediátrica** - Enfermedades renales en niños
50. **Oncología Pediátrica** - Tratamiento del cáncer infantil
51. **Cirugía Pediátrica** - Procedimientos quirúrgicos en niños

---

## Notas de Implementación

- Todas las especialidades fueron agregadas a la base de datos el 31 de enero de 2026
- Script utilizado: `server/src/utils/seedSpecialties.js`
- Las especialidades están disponibles para asignación a doctores en el sistema
- Cada especialidad incluye nombre y descripción detallada

## Uso en el Sistema

Las especialidades se utilizan en:

- Registro de nuevos doctores
- Filtrado de búsqueda en el módulo de Doctores
- Asignación de citas médicas
- Reportes y estadísticas del sistema

## Mantenimiento

Para agregar nuevas especialidades:

```bash
node src/utils/seedSpecialties.js
```

El script usa `findOrCreate` para evitar duplicados.
