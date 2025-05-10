const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')
const fs = require('fs')

const downloadMediaMessage = async(m, filename) => {
    if (m.type === 'viewOnceMessage') {
        m.type = m.msg.type
    }
    const typeMap = {
        imageMessage: 'jpg',
        videoMessage: 'mp4',
        audioMessage: 'mp3',
        stickerMessage: 'webp',
        documentMessage: m.msg?.fileName?.split('.').pop()?.replace('jpeg', 'jpg')?.replace('png', 'jpg')?.replace('m4a', 'mp3') || 'bin'
    }
    const type = typeMap[m.type]
    const name = filename ? `${filename}.${type}` : `undefined.${type}`
    const stream = await downloadContentFromMessage(m.msg, m.type.replace('Message', ''))
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    fs.writeFileSync(name, buffer)
    return fs.readFileSync(name)
}

const sms = (conn, m) => {
    if (m.key) {
        m.id = m.key.id
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = m.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : m.isGroup ? m.key.participant : m.key.remoteJid
    }
    if (m.message) {
        m.type = getContentType(m.message)
        m.msg = (m.type === 'viewOnceMessage') ? m.message[m.type].message[getContentType(m.message[m.type].message)] : m.message[m.type]
        if (m.msg) {
            if (m.type === 'viewOnceMessage') {
                m.msg.type = getContentType(m.message[m.type].message)
            }
            const ci = m.msg.contextInfo || {}
            const mentions = [].concat(ci.mentionedJid || [], ci.participant || []).filter(Boolean)
            m.mentionUser = mentions
            m.body = m.msg.text || m.msg.caption || m.msg.conversation || m.msg.selectedId || m.msg.selectedButtonId || ''

            m.quoted = ci.quotedMessage ? {
                type: getContentType(ci.quotedMessage),
                id: ci.stanzaId,
                sender: ci.participant,
                fromMe: ci.participant?.split('@')[0].includes(conn.user.id.split(':')[0]),
                msg: ci.quotedMessage[getContentType(ci.quotedMessage)],
                mentionUser: [].concat(ci.quotedMessage.contextInfo?.mentionedJid || [], ci.quotedMessage.contextInfo?.participant || []).filter(Boolean),
                fakeObj: proto.WebMessageInfo.fromObject({
                    key: {
                        remoteJid: m.chat,
                        fromMe: ci.participant?.split('@')[0].includes(conn.user.id.split(':')[0]),
                        id: ci.stanzaId,
                        participant: ci.participant
                    },
                    message: ci.quotedMessage
                })
            } : null

            if (m.quoted) {
                m.quoted.download = (filename) => downloadMediaMessage(m.quoted, filename)
                m.quoted.delete = () => conn.sendMessage(m.chat, { delete: m.quoted.fakeObj.key })
                m.quoted.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.quoted.fakeObj.key } })
            }
        }
        m.download = (filename) => downloadMediaMessage(m, filename)
    }

    m.reply = (text, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { text, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyS = (stik, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { sticker: stik, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyImg = (img, text, id = m.chat, option = { mentions: [m.sender] }) => conn.sendMessage(id, { image: img, caption: text, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyVid = (vid, text, id = m.chat, option = { mentions: [m.sender], gif: false }) => conn.sendMessage(id, { video: vid, caption: text, gifPlayback: option.gif, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyAud = (aud, id = m.chat, option = { mentions: [m.sender], ptt: false }) => conn.sendMessage(id, { audio: aud, ptt: option.ptt, mimetype: 'audio/mpeg', contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyDoc = (doc, id = m.chat, option = { mentions: [m.sender], filename: 'file.pdf', mimetype: 'application/pdf' }) => conn.sendMessage(id, { document: doc, mimetype: option.mimetype, fileName: option.filename, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyContact = (name, info, number) => {
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${info};\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`
        conn.sendMessage(m.chat, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: m })
    }
    m.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

    return m
}

module.exports = { sms, downloadMediaMessage }
