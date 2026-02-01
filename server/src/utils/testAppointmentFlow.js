const axios = require('axios');

async function test() {
    try {
        console.log('🔐 Iniciando sesión...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@medicus.com',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log('✅ Login exitoso. Token obtenido.');

        const config = {
            headers: { 'x-auth-token': token }
        };

        console.log('🔍 Buscando doctor y paciente para prueba...');
        
        const doctorsRes = await axios.get('http://localhost:5000/api/doctors', config);
        if (doctorsRes.data.length === 0) throw new Error('No doctors found via API');
        const doctor = doctorsRes.data[0];
        console.log(`👨‍⚕️ Doctor seleccionado: ${doctor.User.firstName} ${doctor.User.lastName}`);

        const patientsRes = await axios.get('http://localhost:5000/api/patients', config);
        if (patientsRes.data.length === 0) throw new Error('No patients found via API');
        const patient = patientsRes.data[0];
        console.log(`🏥 Paciente seleccionado: ${patient.User.firstName} ${patient.User.lastName}`);

        // Create date for tomorrow 10am
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(10, 0, 0, 0);

        console.log('📅 Intentando agendar cita a través de API para:', date.toLocaleString());

        const payload = {
            patientId: patient.id,
            doctorId: doctor.id, 
            date: date.toISOString(),
            reason: 'Consulta General - Prueba Automática',
            notes: 'Paciente requiere chequeo general.'
        };

        const response = await axios.post('http://localhost:5000/api/appointments', payload, config);
        
        console.log('\n✅ Cita creada exitosamente!');
        console.log('ID:', response.data.id);
        console.log('Status:', response.data.status);
        console.log('👉 Revisa la consola del SERVIDOR para ver el mensaje de WhatsApp simulado.');

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

test();
