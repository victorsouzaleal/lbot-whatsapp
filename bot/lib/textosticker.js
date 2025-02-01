import { createCanvas, loadImage } from 'canvas'

export async function textoImagem(mensagemBaileys, ppUrl, nomeUsuario) {
  const { citacao } = mensagemBaileys
  const texto = citacao ? citacao.corpo : mensagemBaileys.corpo

  const canvas = createCanvas(512, 512)
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const imagemPerfil = await loadImage(ppUrl)

  // Parâmetros ajustados
  const bubblePadding = 20
  const maxTextWidth = 300
  const usernameFont = 'bold 40px Arial'
  const messageFont = '40px Arial'
  const usernameHeight = 45
  const marginBetween = 35 // Aumentado para 25 pixels
  const lineHeight = 45

  // Quebra de linha da mensagem (mantido igual)
  ctx.font = messageFont
  const words = texto.split(' ')
  const lines = []
  let currentLine = ''
  for (let word of words) {
    const testLine = currentLine + word + ' '
    if (ctx.measureText(testLine).width > maxTextWidth && currentLine !== '') {
      lines.push(currentLine.trim())
      currentLine = word + ' '
    } else {
      currentLine = testLine
    }
  }
  lines.push(currentLine.trim())

  // Largura máxima da mensagem
  let measuredMsgWidth = 0
  ctx.font = messageFont
  for (let line of lines) {
    const w = ctx.measureText(line).width
    if (w > measuredMsgWidth) measuredMsgWidth = w
  }

  // Largura do nome do usuário
  ctx.font = usernameFont
  const usernameWidth = ctx.measureText(nomeUsuario).width

  // Largura do balão
  const bubbleContentWidth = Math.max(
    measuredMsgWidth,
    Math.min(usernameWidth, maxTextWidth)
  )
  const bubbleWidth = bubbleContentWidth + bubblePadding * 2

  // Altura do balão
  const bubbleHeight =
    bubblePadding +
    usernameHeight +
    marginBetween +
    lines.length * lineHeight +
    bubblePadding

  // Configuração da foto e grupo
  const tamanhoPerfil = 100
  const spacing = 15 // Aumentado para mais espaço entre foto e balão

  // Largura e altura do grupo
  const groupWidth = tamanhoPerfil + spacing + bubbleWidth
  const groupHeight = Math.max(tamanhoPerfil, bubbleHeight) // Mantém a altura maior entre foto e balão

  // Centralização do grupo no canvas
  const groupX = 0
  const groupY = (512 - groupHeight) / 2

  // Posição da foto (centralizada verticalmente no grupo)
  const xPerfil = groupX
  const yPerfil = groupY + (groupHeight - tamanhoPerfil) / 2

  // Posição do balão
  const bubbleX = groupX + tamanhoPerfil + spacing
  const bubbleY = groupY + (groupHeight - bubbleHeight) / 2

  // Desenhar a foto
  ctx.save()
  ctx.beginPath()
  ctx.arc(
    xPerfil + tamanhoPerfil / 2,
    yPerfil + tamanhoPerfil / 2,
    tamanhoPerfil / 2,
    0,
    Math.PI * 2
  )
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(imagemPerfil, xPerfil, yPerfil, tamanhoPerfil, tamanhoPerfil)
  ctx.restore()

  // Desenhar o balão
  ctx.fillStyle = '#2B2B2B'
  ctx.beginPath()
  ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 20)
  ctx.fill()

  // Escrever nome do usuário
  ctx.fillStyle = '#FFA500'
  ctx.font = usernameFont
  ctx.fillText(
    nomeUsuario,
    bubbleX + bubblePadding,
    bubbleY + bubblePadding + usernameHeight * 0.8
  )

  // Escrever mensagem
  ctx.fillStyle = '#ffffff'
  ctx.font = messageFont
  const textStartY = bubbleY + bubblePadding + usernameHeight + marginBetween
  lines.forEach((line, index) => {
    ctx.fillText(line, bubbleX + bubblePadding, textStartY + index * lineHeight)
  })

  return canvas.toBuffer('image/png')
}
