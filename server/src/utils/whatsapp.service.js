/**
 * WhatsApp Service (Simulation)
 * In a real environment, you would use Twilio, UltraMsg, or a similar provider.
 */
class WhatsAppService {
  async sendAppointmentReminder(patientPhone, appointmentDetails) {
    const { patientName, date, time, doctorName } = appointmentDetails;
    
    const message = `Hola ${patientName}, recordatorio de tu cita médica:
📅 Fecha: ${date}
⏰ Hora: ${time}
👨‍⚕️ Doctor: ${doctorName}
🏥 Clínica Medicus
Por favor confirma tu asistencia.`;

    console.log('--- ENVIANDO WHATSAPP (SIMULACIÓN) ---');
    console.log(`Para: ${patientPhone}`);
    console.log(`Mensaje: \n${message}`);
    console.log('---------------------------------------');

    // Here you would make an axios call to your WhatsApp API provider
    // Example: 
    // await axios.post(provider_url, { to: patientPhone, body: message }, { headers: { ... } });

    return { success: true, messageId: 'sim-' + Date.now() };
  }
}

module.exports = new WhatsAppService();
