---
description: Implementar módulo de videoconsultas con WebRTC
---

# 🎥 Implementación de Módulo de Videoconsultas - Medicus

## 📋 Resumen del Proyecto

**Objetivo:** Agregar funcionalidad de telemedicina mediante videoconsultas en tiempo real entre doctores y pacientes.

**Tecnología Principal:** WebRTC + Socket.io + Simple-peer

**Tiempo Estimado:** 3-5 días de desarrollo

---

## 🏗️ Arquitectura Propuesta

### Stack Tecnológico

**Frontend:**

- `simple-peer` - Abstracción de WebRTC
- `socket.io-client` - Cliente WebSocket
- Angular Signals para estado reactivo
- Componente de videollamada standalone

**Backend:**

- `socket.io` - Servidor de señalización WebSocket
- Express para API REST
- STUN/TURN servers (coturn o servicios públicos)

**Base de Datos:**

- Nueva tabla: `VideoConsultations`
- Relaciones: Doctor ↔ Patient ↔ Appointment

---

## 📦 Fase 1: Instalación de Dependencias

### Backend (Server)

```bash
cd server
npm install socket.io cors
```

### Frontend (Client)

```bash
cd client
npm install simple-peer socket.io-client
npm install --save-dev @types/simple-peer
```

---

## 🗄️ Fase 2: Modelo de Base de Datos

### Crear Modelo: `VideoConsultation.js`

**Ubicación:** `server/src/models/VideoConsultation.js`

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const VideoConsultation = sequelize.define(
  "VideoConsultation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Appointments",
        key: "id",
      },
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    roomId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "active", "completed", "cancelled"),
      defaultValue: "scheduled",
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER, // en minutos
      allowNull: true,
    },
    recordingUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "VideoConsultations",
    timestamps: true,
  },
);

module.exports = VideoConsultation;
```

### Actualizar `server/src/models/index.js`

Agregar relaciones:

```javascript
const VideoConsultation = require("./VideoConsultation");

// Relaciones
VideoConsultation.belongsTo(User, { as: "doctor", foreignKey: "doctorId" });
VideoConsultation.belongsTo(User, { as: "patient", foreignKey: "patientId" });
VideoConsultation.belongsTo(Appointment, { foreignKey: "appointmentId" });
Appointment.hasOne(VideoConsultation, { foreignKey: "appointmentId" });

module.exports = {
  // ... otros modelos
  VideoConsultation,
};
```

---

## 🔌 Fase 3: Servidor de Señalización (WebSocket)

### Crear: `server/src/sockets/videoSocket.js`

```javascript
const socketIO = require("socket.io");

let io;
const activeRooms = new Map(); // roomId -> { doctor, patient, status }

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:4200",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Usuario conectado:", socket.id);

    // Usuario se une a una sala
    socket.on("join-room", ({ roomId, userId, userType }) => {
      socket.join(roomId);

      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, { participants: [] });
      }

      const room = activeRooms.get(roomId);
      room.participants.push({ socketId: socket.id, userId, userType });

      console.log(`👤 ${userType} ${userId} se unió a sala ${roomId}`);

      // Notificar a otros participantes
      socket.to(roomId).emit("user-joined", { userId, userType });

      // Si ya hay alguien en la sala, iniciar conexión
      if (room.participants.length === 2) {
        io.to(roomId).emit("ready-to-connect");
      }
    });

    // Señalización WebRTC
    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", candidate);
    });

    // Usuario sale de la sala
    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left");

      const room = activeRooms.get(roomId);
      if (room) {
        room.participants = room.participants.filter(
          (p) => p.socketId !== socket.id,
        );
        if (room.participants.length === 0) {
          activeRooms.delete(roomId);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Usuario desconectado:", socket.id);

      // Limpiar salas
      activeRooms.forEach((room, roomId) => {
        room.participants = room.participants.filter(
          (p) => p.socketId !== socket.id,
        );
        if (room.participants.length === 0) {
          activeRooms.delete(roomId);
        } else {
          io.to(roomId).emit("user-left");
        }
      });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
```

### Actualizar `server/src/index.js`

```javascript
const express = require("express");
const http = require("http");
const { initializeSocket } = require("./sockets/videoSocket");

const app = express();
const server = http.createServer(app); // Crear servidor HTTP

// ... middlewares existentes

// Inicializar Socket.io
initializeSocket(server);

// ... rutas existentes

// Cambiar app.listen por server.listen
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ force: false })
  .then(async () => {
    await seedRoles();
    await seedTestData();

    require("./utils/scheduler")();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
      console.log(`🎥 WebSocket server ready for video consultations`);
    });
  })
  .catch((err) => console.log("Error syncing database: " + err));
```

---

## 🎮 Fase 4: Controlador y Rutas (Backend)

### Crear: `server/src/controllers/videoConsultation.controller.js`

```javascript
const { VideoConsultation, User, Appointment } = require("../models");
const { v4: uuidv4 } = require("uuid");

// Crear sala de videoconsulta
exports.createVideoConsultation = async (req, res) => {
  try {
    const { appointmentId, patientId } = req.body;
    const doctorId = req.userId; // Del middleware de auth

    // Verificar que la cita existe
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    // Generar ID único para la sala
    const roomId = uuidv4();

    const videoConsultation = await VideoConsultation.create({
      appointmentId,
      doctorId,
      patientId,
      roomId,
      status: "scheduled",
    });

    res.status(201).json({
      message: "Videoconsulta creada exitosamente",
      videoConsultation,
    });
  } catch (error) {
    console.error("Error creando videoconsulta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener videoconsulta por ID
exports.getVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const videoConsultation = await VideoConsultation.findByPk(id, {
      include: [
        {
          model: User,
          as: "doctor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        { model: Appointment },
      ],
    });

    if (!videoConsultation) {
      return res.status(404).json({ message: "Videoconsulta no encontrada" });
    }

    res.json(videoConsultation);
  } catch (error) {
    console.error("Error obteniendo videoconsulta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Iniciar videoconsulta
exports.startVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const videoConsultation = await VideoConsultation.findByPk(id);
    if (!videoConsultation) {
      return res.status(404).json({ message: "Videoconsulta no encontrada" });
    }

    videoConsultation.status = "active";
    videoConsultation.startTime = new Date();
    await videoConsultation.save();

    res.json({
      message: "Videoconsulta iniciada",
      videoConsultation,
    });
  } catch (error) {
    console.error("Error iniciando videoconsulta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Finalizar videoconsulta
exports.endVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const videoConsultation = await VideoConsultation.findByPk(id);
    if (!videoConsultation) {
      return res.status(404).json({ message: "Videoconsulta no encontrada" });
    }

    const endTime = new Date();
    const duration = Math.round(
      (endTime - new Date(videoConsultation.startTime)) / 60000,
    ); // minutos

    videoConsultation.status = "completed";
    videoConsultation.endTime = endTime;
    videoConsultation.duration = duration;
    videoConsultation.notes = notes;
    await videoConsultation.save();

    res.json({
      message: "Videoconsulta finalizada",
      videoConsultation,
    });
  } catch (error) {
    console.error("Error finalizando videoconsulta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Listar videoconsultas del doctor
exports.getDoctorVideoConsultations = async (req, res) => {
  try {
    const doctorId = req.userId;

    const consultations = await VideoConsultation.findAll({
      where: { doctorId },
      include: [
        {
          model: User,
          as: "patient",
          attributes: ["id", "firstName", "lastName"],
        },
        { model: Appointment },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(consultations);
  } catch (error) {
    console.error("Error obteniendo videoconsultas:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
```

### Crear: `server/src/routes/videoConsultation.routes.js`

```javascript
const express = require("express");
const router = express.Router();
const videoConsultationController = require("../controllers/videoConsultation.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.post("/", videoConsultationController.createVideoConsultation);
router.get(
  "/my-consultations",
  videoConsultationController.getDoctorVideoConsultations,
);
router.get("/:id", videoConsultationController.getVideoConsultation);
router.put("/:id/start", videoConsultationController.startVideoConsultation);
router.put("/:id/end", videoConsultationController.endVideoConsultation);

module.exports = router;
```

### Actualizar `server/src/index.js` (agregar ruta)

```javascript
app.use(
  "/api/video-consultations",
  require("./routes/videoConsultation.routes"),
);
```

---

## 🎨 Fase 5: Componente de Videollamada (Frontend)

### Crear Servicio: `client/src/app/services/video-consultation.service.ts`

```typescript
import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import SimplePeer from "simple-peer";

interface VideoConsultation {
  id: number;
  roomId: string;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  status: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

@Injectable({
  providedIn: "root",
})
export class VideoConsultationService {
  private apiUrl = "http://localhost:5000/api/video-consultations";
  private socket: Socket | null = null;
  private peer: SimplePeer.Instance | null = null;

  // Signals para estado reactivo
  isConnected = signal(false);
  remoteStream = signal<MediaStream | null>(null);
  localStream = signal<MediaStream | null>(null);
  isMuted = signal(false);
  isVideoOff = signal(false);

  constructor(private http: HttpClient) {}

  // API REST
  createVideoConsultation(
    appointmentId: number,
    patientId: number,
  ): Observable<any> {
    return this.http.post(this.apiUrl, { appointmentId, patientId });
  }

  getVideoConsultation(id: number): Observable<VideoConsultation> {
    return this.http.get<VideoConsultation>(`${this.apiUrl}/${id}`);
  }

  startVideoConsultation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/start`, {});
  }

  endVideoConsultation(id: number, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/end`, { notes });
  }

  getMyConsultations(): Observable<VideoConsultation[]> {
    return this.http.get<VideoConsultation[]>(
      `${this.apiUrl}/my-consultations`,
    );
  }

  // WebRTC y Socket.io
  async initializeMedia(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      this.localStream.set(stream);
      return stream;
    } catch (error) {
      console.error("Error accediendo a cámara/micrófono:", error);
      throw error;
    }
  }

  connectToRoom(
    roomId: string,
    userId: number,
    userType: "doctor" | "patient",
  ) {
    this.socket = io("http://localhost:5000");

    this.socket.on("connect", () => {
      console.log("✅ Conectado al servidor WebSocket");
      this.socket!.emit("join-room", { roomId, userId, userType });
    });

    this.socket.on("ready-to-connect", () => {
      console.log("🎥 Listo para conectar");
      this.createPeerConnection(userType === "doctor");
    });

    this.socket.on("offer", (offer: SimplePeer.SignalData) => {
      if (this.peer) {
        this.peer.signal(offer);
      }
    });

    this.socket.on("answer", (answer: SimplePeer.SignalData) => {
      if (this.peer) {
        this.peer.signal(answer);
      }
    });

    this.socket.on("ice-candidate", (candidate: SimplePeer.SignalData) => {
      if (this.peer) {
        this.peer.signal(candidate);
      }
    });

    this.socket.on("user-left", () => {
      console.log("❌ Usuario abandonó la sala");
      this.remoteStream.set(null);
      this.isConnected.set(false);
    });
  }

  private createPeerConnection(initiator: boolean) {
    const stream = this.localStream();
    if (!stream) return;

    this.peer = new SimplePeer({
      initiator,
      stream,
      trickle: true,
    });

    this.peer.on("signal", (data: SimplePeer.SignalData) => {
      if (initiator) {
        this.socket!.emit("offer", {
          roomId: this.getCurrentRoomId(),
          offer: data,
        });
      } else {
        this.socket!.emit("answer", {
          roomId: this.getCurrentRoomId(),
          answer: data,
        });
      }
    });

    this.peer.on("stream", (remoteStream: MediaStream) => {
      console.log("📹 Stream remoto recibido");
      this.remoteStream.set(remoteStream);
      this.isConnected.set(true);
    });

    this.peer.on("error", (err: Error) => {
      console.error("❌ Error en peer:", err);
    });
  }

  toggleMute() {
    const stream = this.localStream();
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      this.isMuted.set(!audioTrack.enabled);
    }
  }

  toggleVideo() {
    const stream = this.localStream();
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      this.isVideoOff.set(!videoTrack.enabled);
    }
  }

  disconnect() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    if (this.socket) {
      this.socket.emit("leave-room", { roomId: this.getCurrentRoomId() });
      this.socket.disconnect();
      this.socket = null;
    }

    const stream = this.localStream();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      this.localStream.set(null);
    }

    this.remoteStream.set(null);
    this.isConnected.set(false);
  }

  private getCurrentRoomId(): string {
    // Implementar lógica para obtener roomId actual
    return "";
  }
}
```

### Crear Componente: `client/src/app/components/video-call/video-call.component.ts`

```typescript
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { VideoConsultationService } from "../../services/video-consultation.service";

@Component({
  selector: "app-video-call",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./video-call.component.html",
  styleUrls: ["./video-call.component.css"],
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild("localVideo") localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild("remoteVideo") remoteVideo!: ElementRef<HTMLVideoElement>;

  consultationId = signal<number | null>(null);
  roomId = signal<string>("");
  isDoctor = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public videoService: VideoConsultationService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params["id"];
    this.consultationId.set(+id);

    // Obtener datos de la consulta
    this.videoService.getVideoConsultation(+id).subscribe({
      next: async (consultation) => {
        this.roomId.set(consultation.roomId);

        // Determinar si es doctor o paciente
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        this.isDoctor.set(user.id === consultation.doctorId);

        // Inicializar media
        try {
          await this.videoService.initializeMedia();

          // Conectar al room
          this.videoService.connectToRoom(
            consultation.roomId,
            user.id,
            this.isDoctor() ? "doctor" : "patient",
          );

          // Iniciar consulta si es doctor
          if (this.isDoctor()) {
            this.videoService.startVideoConsultation(+id).subscribe();
          }
        } catch (error) {
          console.error("Error inicializando videollamada:", error);
          alert("No se pudo acceder a la cámara o micrófono");
        }
      },
      error: (err) => {
        console.error("Error cargando consulta:", err);
        this.router.navigate(["/dashboard"]);
      },
    });
  }

  ngAfterViewInit() {
    // Suscribirse a cambios en streams
    this.videoService.localStream.subscribe((stream) => {
      if (stream && this.localVideo) {
        this.localVideo.nativeElement.srcObject = stream;
      }
    });

    this.videoService.remoteStream.subscribe((stream) => {
      if (stream && this.remoteVideo) {
        this.remoteVideo.nativeElement.srcObject = stream;
      }
    });
  }

  toggleMute() {
    this.videoService.toggleMute();
  }

  toggleVideo() {
    this.videoService.toggleVideo();
  }

  async endCall() {
    const notes = prompt("Notas de la consulta (opcional):");

    if (this.isDoctor() && this.consultationId()) {
      this.videoService
        .endVideoConsultation(this.consultationId()!, notes || "")
        .subscribe({
          next: () => {
            this.videoService.disconnect();
            this.router.navigate(["/dashboard"]);
          },
        });
    } else {
      this.videoService.disconnect();
      this.router.navigate(["/dashboard"]);
    }
  }

  ngOnDestroy() {
    this.videoService.disconnect();
  }
}
```

### Crear Template: `client/src/app/components/video-call/video-call.component.html`

```html
<div class="video-call-container">
  <!-- Video Remoto (Principal) -->
  <div class="remote-video-wrapper">
    <video #remoteVideo autoplay playsinline class="remote-video"></video>

    @if (!videoService.isConnected()) {
    <div class="waiting-overlay">
      <div class="spinner-border text-light" role="status"></div>
      <p class="mt-3">Esperando al otro participante...</p>
    </div>
    }
  </div>

  <!-- Video Local (Picture-in-Picture) -->
  <div class="local-video-wrapper">
    <video #localVideo autoplay muted playsinline class="local-video"></video>
    @if (videoService.isVideoOff()) {
    <div class="video-off-overlay">
      <i class="bi bi-camera-video-off"></i>
    </div>
    }
  </div>

  <!-- Controles -->
  <div class="controls">
    <button
      class="btn btn-control"
      [class.active]="!videoService.isMuted()"
      (click)="toggleMute()"
    >
      <i
        class="bi"
        [class.bi-mic-fill]="!videoService.isMuted()"
        [class.bi-mic-mute-fill]="videoService.isMuted()"
      ></i>
    </button>

    <button
      class="btn btn-control"
      [class.active]="!videoService.isVideoOff()"
      (click)="toggleVideo()"
    >
      <i
        class="bi"
        [class.bi-camera-video-fill]="!videoService.isVideoOff()"
        [class.bi-camera-video-off-fill]="videoService.isVideoOff()"
      ></i>
    </button>

    <button class="btn btn-danger btn-end-call" (click)="endCall()">
      <i class="bi bi-telephone-x-fill"></i>
      Finalizar
    </button>
  </div>

  <!-- Info de la llamada -->
  <div class="call-info">
    <span class="badge bg-success" *ngIf="videoService.isConnected()">
      <i class="bi bi-circle-fill blink"></i> Conectado
    </span>
    <span class="badge bg-warning" *ngIf="!videoService.isConnected()">
      <i class="bi bi-circle-fill"></i> Esperando...
    </span>
  </div>
</div>
```

### Crear Estilos: `client/src/app/components/video-call/video-call.component.css`

```css
.video-call-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 9999;
}

.remote-video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.remote-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.waiting-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.local-video-wrapper {
  position: absolute;
  bottom: 100px;
  right: 20px;
  width: 250px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 3px solid #fff;
}

.local-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-off-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
}

.btn-control {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.btn-control:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.btn-control.active {
  background: rgba(74, 144, 226, 0.8);
}

.btn-end-call {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 1.5rem;
}

.call-info {
  position: absolute;
  top: 20px;
  left: 20px;
}

.blink {
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%,
  50%,
  100% {
    opacity: 1;
  }
  25%,
  75% {
    opacity: 0.3;
  }
}
```

---

## 🔧 Fase 6: Integración con el Sistema

### Agregar Ruta en `client/src/app/app.routes.ts`

```typescript
{
  path: 'video-call/:id',
  component: VideoCallComponent,
  canActivate: [AuthGuard]
}
```

### Agregar Botón en Citas (Ejemplo)

En `client/src/app/components/appointments/appointments.component.html`:

```html
<button
  class="btn btn-primary btn-sm"
  (click)="startVideoCall(appointment.id)"
  *ngIf="appointment.status === 'confirmed'"
>
  <i class="bi bi-camera-video"></i>
  Iniciar Videoconsulta
</button>
```

En el componente:

```typescript
startVideoCall(appointmentId: number) {
  // Crear videoconsulta
  this.videoService.createVideoConsultation(appointmentId, this.patientId).subscribe({
    next: (result) => {
      this.router.navigate(['/video-call', result.videoConsultation.id]);
    },
    error: (err) => {
      console.error('Error creando videoconsulta:', err);
    }
  });
}
```

---

## 🧪 Fase 7: Testing

### Probar Localmente

1. Abrir dos navegadores diferentes (Chrome y Firefox)
2. Iniciar sesión como doctor en uno
3. Iniciar sesión como paciente en otro
4. Crear una videoconsulta
5. Ambos usuarios deben unirse a la sala
6. Verificar video y audio bidireccional

---

## 🚀 Fase 8: Mejoras Futuras

- [ ] Grabación de sesiones
- [ ] Chat de texto durante la llamada
- [ ] Compartir pantalla
- [ ] Sala de espera virtual
- [ ] Notificaciones push cuando el doctor está listo
- [ ] Calidad adaptativa de video
- [ ] Integración con calendario
- [ ] Historial de videoconsultas en el perfil

---

## 📝 Notas Importantes

1. **STUN/TURN Servers:** Para producción, necesitarás configurar servidores TURN propios o usar servicios como:
   - Twilio STUN/TURN
   - Xirsys
   - coturn (auto-hospedado)

2. **HTTPS Obligatorio:** WebRTC requiere HTTPS en producción (excepto localhost)

3. **Permisos del Navegador:** Los usuarios deben otorgar permisos de cámara/micrófono

4. **Firewall:** Asegúrate de que los puertos WebRTC estén abiertos

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias backend
- [ ] Instalar dependencias frontend
- [ ] Crear modelo VideoConsultation
- [ ] Crear servidor WebSocket
- [ ] Crear controlador y rutas
- [ ] Crear servicio Angular
- [ ] Crear componente de videollamada
- [ ] Agregar rutas
- [ ] Integrar con módulo de citas
- [ ] Probar funcionalidad
- [ ] Configurar STUN/TURN para producción
- [ ] Actualizar documentación

---

**Tiempo estimado total:** 3-5 días de desarrollo activo
