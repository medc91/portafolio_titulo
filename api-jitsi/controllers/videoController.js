const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const generarSala = (req, res) => {
    try {
        const { roomName, user, isModerator = true, roomConfig = {} } = req.body;

        const roomId = roomName || uuidv4();
        const domain = process.env.JITSI_DOMAIN || 'meet.jit.si';

        let token;
        if (process.env.JITSI_SECRET) {
            token = jwt.sign({
                room: roomId,
                context: {
                    user: {
                        name: user?.name || 'Invitado',
                        email: user?.email || '',
                        id: user?.id || uuidv4()
                    }
                },
                moderator: isModerator,
                aud: 'jitsi',
                iss: process.env.JITSI_APP_ID,
                sub: domain,
                exp: Math.floor(Date.now() / 1000) + 3600
            }, process.env.JITSI_SECRET);
        }

        const jitsiUrl = `${domain}/${roomId}${token ? `?jwt=${token}` : ''}`;

        res.json({
            success: true,
            roomId,
            url: jitsiUrl,
            token: token || undefined,
            config: {
                ...roomConfig,
                startWithAudioMuted: true,
                startWithVideoMuted: false
            }
        });
    } catch (error) {
        console.error('Error al generar sala:', error);
        res.status(500).json({ error: 'Error al generar la sala' });
    }
};

module.exports = { generarSala };