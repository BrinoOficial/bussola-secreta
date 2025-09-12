let etapas = [45, 0, 180, 0, 315]
let etapaAtual = 0
let margemErro = 5
let margemSaida = 20
let senha = "ESTAMOS EM TODOS OS COMPUTADORES"
let completou = false
let esperandoNovoAlvo = false
let alinhado = false
let ultimaAtualizacao = input.runningTime()

function diferencaAngulo(a: number, b: number): number {
    let diff = Math.abs(a - b) % 360
    return diff > 180 ? 360 - diff : diff
}

function setaDoAlvo(alvo: number) {
    if (alvo == 45) {
        basic.showArrow(ArrowNames.NorthEast)
    } else if (alvo == 180) {
        basic.showArrow(ArrowNames.South)
    } else if (alvo == 315) {
        basic.showArrow(ArrowNames.NorthWest)
    } else if (alvo == 90) {
        basic.showArrow(ArrowNames.East)
    } else if (alvo == 270) {
        basic.showArrow(ArrowNames.West)
    } else if (alvo == 0) {
        basic.showString("N")   // agora mostra N quando alvo é 0°
    }
}

input.onButtonPressed(Button.A, function () {
    etapaAtual = 0
    completou = false
    esperandoNovoAlvo = false
    alinhado = false

    basic.showString("N")  // pede para alinhar ao Norte no início
})

basic.forever(function () {
    if (!alinhado && !completou) {
        let direcao = input.compassHeading()
        if (diferencaAngulo(direcao, 0) <= margemErro) {
            alinhado = true
            basic.showNumber(1)
            basic.pause(1000)
        }
        return
    }

    if (!completou && etapaAtual < etapas.length) {
        let direcao = input.compassHeading()
        let alvo = etapas[etapaAtual]

        // só atualiza a seta/letra a cada 300ms
        if (input.runningTime() - ultimaAtualizacao > 300) {
            setaDoAlvo(alvo)
            ultimaAtualizacao = input.runningTime()
        }

        let dentroDaMargem = diferencaAngulo(direcao, alvo) <= margemErro
        let saiuDoAlvo = diferencaAngulo(direcao, alvo) > margemSaida

        if (dentroDaMargem && !esperandoNovoAlvo) {
            etapaAtual += 1
            esperandoNovoAlvo = true

            if (etapaAtual < etapas.length) {
                basic.showNumber(etapaAtual + 1)
                basic.pause(1000)
            } else {
                completou = true
                basic.clearScreen()
                music.startMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once)
                basic.pause(2000)
                basic.showString(senha)
                basic.clearScreen()
            }
        }

        if (saiuDoAlvo) {
            esperandoNovoAlvo = false
        }
    }
})
