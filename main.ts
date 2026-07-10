control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    sende_stopp()
})
function sende_stopp () {
    radio.sendValue("gerade", 0)
    radio.sendValue("kurve", 0)
}
function neigungen () {
    gerade = Math.min(Math.max(input.rotation(Rotation.Pitch), -45), 45)
    gerade = Math.round(gerade / g_empfind) * g_empfind
    kurve = Math.min(Math.max(input.rotation(Rotation.Roll), -45), 45)
    kurve = kurve / 5
}
input.onButtonPressed(Button.AB, function () {
    beweg_flag = !(beweg_flag)
    if (beweg_flag) {
        basic.showString("A")
    } else {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
    }
})
input.onButtonPressed(Button.B, function () {
    beweg_flag = false
    radio.sendValue("get_dist", 1)
})
radio.onReceivedValue(function (name, value) {
    if (name == "distanz") {
        basic.showNumber(value)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
    }
})
let kurve = 0
let gerade = 0
let g_empfind = 0
let beweg_flag = false
beweg_flag = false
radio.setGroup(99)
basic.showString("99")
g_empfind = 1
let ist_oben = true
let alt_gerade = -99
let alt_kurve = -99
let k_empfind = 1
basic.showLeds(`
    . . . . .
    . . . . .
    . . # . .
    . . . . .
    . . . . .
    `)
basic.forever(function () {
    neigungen()
    if (input.buttonIsPressed(Button.A) || beweg_flag) {
        if (gerade != alt_gerade || kurve != alt_kurve) {
            radio.sendValue("gerade", gerade)
            radio.sendValue("kurve", kurve)
        }
    }
    alt_gerade = gerade
    alt_kurve = kurve
})
