# altivia-email-hook

Servicio HTTP que recibe el **Send Email Hook** de Supabase Auth y envía los correos de autenticación de Altivia por SMTP (nodemailer), en lugar del SMTP integrado de Supabase.

```
Supabase Auth ──POST /send-email──▶ altivia-email-hook ──SMTP──▶ usuario
   (webhook firmado)                 verifica firma + renderiza
```

## Flujo

1. Supabase llama a `POST /send-email` con el payload firmado (Standard Webhooks).
2. Se verifica la firma con `SEND_EMAIL_HOOK_SECRET`.
3. Se renderiza el asunto y el HTML según el tipo de correo.
4. Se envía por SMTP.

Tipos soportados: `signup`, `recovery`, `magiclink`, `invite`, `email_change`, `reauthentication`.

## Endpoints

| Método | Ruta          | Descripción                              |
|--------|---------------|------------------------------------------|
| GET    | `/health`     | Healthcheck, responde `ok`               |
| POST   | `/send-email` | Webhook de Supabase. Responde `{}` si OK |

Errores, con formato `{"error": {"http_code": N, "message": "..."}}`:

| Código | Causa                                |
|--------|--------------------------------------|
| 401    | Firma del webhook inválida           |
| 400    | Payload de correo inválido           |
| 500    | Fallo al enviar (el detalle va al log) |

## Variables de entorno

| Variable                 | Requerida | Default | Descripción                         |
|--------------------------|-----------|---------|-------------------------------------|
| `SEND_EMAIL_HOOK_SECRET` | sí        | —       | Secret del hook en Supabase         |
| `SUPABASE_URL`           | sí        | —       | URL del proyecto, para armar el link de verificación |
| `SMTP_HOST`              | sí        | —       | Host SMTP                           |
| `SMTP_PORT`              | no        | `587`   | Puerto SMTP                         |
| `SMTP_USER`              | sí        | —       | Usuario SMTP                        |
| `SMTP_PASS`              | sí        | —       | Contraseña SMTP                     |
| `MAIL_FROM`              | sí        | —       | Remitente                           |
| `PORT`                   | no        | `3000`  | Puerto HTTP (la imagen usa `80`)    |

Ejemplo de `.env`:

```env
PORT=3000
SEND_EMAIL_HOOK_SECRET=v1,whsec_xxxxxxxx
SUPABASE_URL=https://xxxx.supabase.co
SMTP_HOST=127.0.0.1
SMTP_PORT=2587
SMTP_USER=noreply@altivia.lat
SMTP_PASS=********
MAIL_FROM=Altivia <noreply@altivia.lat>
```

> Nunca subas `.env` al repo. Ya está en `.gitignore` y `.dockerignore`.

## Desarrollo local

Requisitos: Node 22+ y pnpm.

```bash
pnpm install
pnpm dev        # tsx watch con .env
```

Servidor en `http://localhost:3000`. Prueba: `curl localhost:3000/health`.

### SMTP vía túnel SSH

Si el SMTP del VPS solo escucha en `127.0.0.1:587`, abre un túnel desde tu máquina:

```bash
ssh -N -L 2587:127.0.0.1:587 root@<IP_VPS>
```

y usa `SMTP_HOST=127.0.0.1` y `SMTP_PORT=2587`. Verifica con `nc -zv 127.0.0.1 2587`.

## Docker

```bash
docker build -t altivia-email-hook .
docker run --rm -p 8080:80 --env-file .env altivia-email-hook
```

Build multi-stage: compila con `tsup` y corre `node dist/main.js`, con healthcheck en `/health`.

En el VPS el contenedor no alcanza el `127.0.0.1` del host. Ponlo en la misma red Docker que el contenedor SMTP y usa su nombre como `SMTP_HOST`.

## CI/CD

`.github/workflows/deploy.yml`, en push a `main`:

1. **verify**: instala, `lint`, `check` y `build`.
2. **publish**: construye y publica la imagen en `ghcr.io/<owner>/<repo>` (`latest` y SHA).
3. **deploy**: por SSH al VPS, hace `docker compose pull && up -d` con secretos de Infisical.

Los secretos y variables del repo (`VPS_*`, `INFISICAL_*`) se configuran en GitHub.

## Configurar en Supabase

1. Dashboard → Authentication → Hooks → **Send Email**.
2. Tipo HTTPS, URL `https://<tu-dominio>/send-email`.
3. Genera el secret y cópialo a `SEND_EMAIL_HOOK_SECRET`.

## Estructura

```
src/
├── main.ts                 # composición y arranque
├── application/            # casos de uso
├── domain/                 # modelos, puertos, excepciones
├── infrastructure/
│   ├── web/                # controlador Hono
│   ├── webhook/            # verificación Standard Webhooks
│   └── node-mailer/        # SMTP y plantillas HTML
└── shared/                 # config y utilidades
```

Arquitectura hexagonal: `application` depende de puertos en `domain`, las implementaciones viven en `infrastructure`.

## Troubleshooting

| Síntoma                       | Causa probable                                      |
|-------------------------------|-----------------------------------------------------|
| 500 `No se pudo enviar el correo` | Revisa el log `[send-email] error:`             |
| `EHOSTUNREACH` a una IP rara  | `SMTP_HOST` y `SMTP_PORT` invertidos                |
| `ECONNREFUSED 127.0.0.1:2587` | El túnel SSH no está activo                         |
| 401                           | `SEND_EMAIL_HOOK_SECRET` no coincide con Supabase   |
