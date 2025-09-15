// --- FUNÇÕES ---
function diferencaAngulo (a: number, b: number) {
    diff = Math.abs(a - b) % 360
    return diff > 180 ? 360 - diff : diff
}
function esperarBotaoAComNorte () {
    while (true) {
        // manter orientação para o norte na tela
        if (diferencaAngulo(input.compassHeading(), 0) <= margemErro) {
            // alinhado: se o A for pressionado
            if (input.buttonIsPressed(Button.A)) {
                while (input.buttonIsPressed(Button.A)) {
                    music.playTone(988, 120)
                    basic.pause(20)
                }
                return
            } else {
                // pequeno feedback de pronto
                basic.showIcon(IconNames.Yes)
                basic.pause(200)
            }
        } else {
            mostrarSetaParaNorte()
        }
        basic.pause(50)
    }
}
// Espera ficar alinhado ao Norte; ao alinhar, mostra ✅ por 0,5s
function esperarNorte () {
    while (diferencaAngulo(input.compassHeading(), 0) > margemErro) {
        mostrarSetaParaNorte()
        basic.pause(50)
    }
    basic.showIcon(IconNames.Yes)
    basic.pause(500)
}
// Mostra seta para o Norte
function mostrarSetaParaNorte () {
    if (input.runningTime() - ultimaAtualizacao >= 500) {
        heading = input.compassHeading()
        diff2 = (360 - heading) % 360
        mostrarSetaPorDiff(diff2)
        ultimaAtualizacao = input.runningTime()
    }
}
// Mostra seta "em direção ao alvo" até alinhar; confirma com ✅ + bip
function guiarAteAlvo (alvo: number) {
    while (diferencaAngulo(input.compassHeading(), alvo) > margemErro) {
        // seta aponta para onde girar para alcançar o alvo
        heading2 = input.compassHeading()
        diff3 = (alvo - heading2 + 360) % 360
        if (input.runningTime() - ultimaAtualizacao >= 500) {
            mostrarSetaPorDiff(diff3)
            ultimaAtualizacao = input.runningTime()
        }
        basic.pause(50)
    }
    basic.showIcon(IconNames.Yes)
    music.playTone(988, 120)
    basic.pause(500)
}
// Converte um ângulo (0..359) na seta mais próxima (em passos de 45°)
function mostrarSetaPorDiff (diff: number) {
    idx = Math.round(diff / 45) % 8
    switch (idx) {
        case 0: basic.showArrow(ArrowNames.North); break
        case 1: basic.showArrow(ArrowNames.NorthEast); break
        case 2: basic.showArrow(ArrowNames.East); break
        case 3: basic.showArrow(ArrowNames.SouthEast); break
        case 4: basic.showArrow(ArrowNames.South); break
        case 5: basic.showArrow(ArrowNames.SouthWest); break
        case 6: basic.showArrow(ArrowNames.West); break
        case 7: basic.showArrow(ArrowNames.NorthWest); break
    }
}
let idx = 0
let diff3 = 0
let heading2 = 0
let diff2 = 0
let heading = 0
let diff = 0
let ultimaAtualizacao = 0
let margemErro = 0
// --- CONFIGURAÇÕES E ESTADO ---
let etapas = [45, 315, 180]
margemErro = 10
ultimaAtualizacao = input.runningTime()
// --- INÍCIO: calibra, executa sequência uma vez e termina ---
input.calibrateCompass()
basic.clearScreen()
esperarNorte()
esperarBotaoAComNorte()

for (let alvo of etapas) {
    guiarAteAlvo(alvo)
}
music.play(music.stringPlayable("C F D B G - - - ", 240), music.PlaybackMode.UntilDone)
for (let index = 0; index < 4; index++) {
    basic.showString("ESTAMOS EM TODOS OS COMPUTADORES")
}
basic.clearScreen()
