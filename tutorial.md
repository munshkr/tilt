# Tutorial

## Table of Contents

1. [Introduction](#Introduction)
2. [Variables and Waveforms](#Waveforms)
	- Waveforms: `sine`, `saw`, `square`, `pulse`, `triangle`, `noise`
	- Variables: `t`, `o`
3. [Mixing signals](#Mixing-signals)
4. [Frequency: `f`, `m`](#Frequency)
5. [Sequences: `seq`, `seq1`, `aseq`, `rseq`](#Sequences)
6. [Envelope Generators: `env` , `invEnv`](#Envelope-Generators)
7. [Speed: `r`](#Speed)
8. [Randomness: `rand`, `randInt`](#Randomness)
9. [Modulation: RM, AM y FM](#Modulation)
10. [Extensibility: Basic harmony with scales and degrees](#Extensibility)

## Introduction

**Tilt** is a live coding environment for **real-time sound synthesis**. It is programmed in JavaScript and runs on both desktop and mobile browsers (tested on Chrome, Firefox and Safari).

As is often the case in the live coding scene, it is experimental software and can sometimes be buggy and crash, though usually by reloading the page you can recover. Tilt always saves the last thing written, so you only have to reload the page to retrieve it.

Let's start by writing the following line of code:

```javascript
o = sine(t)
```

To create sound in Tilt, we have to define the *variable* `o`. This is the output variable, which determines what will sound through the sound card and through the speakers. It must be a number between 0 and 1. In this case we are defining it with `sine()`, which is a function that generates a sine wave, and its argument in this case is `t`. `t` is a read-only variable that increases continuously, and together with certain mathematical functions it allows to generate periodic waves, which are the ones that "sound".

`t` by default increases at a rate such that `sine(t)` generates a wave at 440 Hz (A4). If we divide `t` by 2 in the `sine` argument, it would go at half speed (220Hz). In musical terms, we would be sounding an octave below. The opposite happens if we multiply by 2 (880Hz, one octave up). You can multiply or divide by decimal numbers as well, and that would generate microtones, but we won't go into that in detail.

## Waveforms

In addition to sine, Tilt has other waveforms defined that can be used as oscillators:

`saw(t)` is the sawtooth waveform.

```javascript
o = saw(t)
```

`pulse(t, width)` is the pulse waveform. This function accepts two parameters, the first is the frequency, and the second, `width` is the width of the active pulse, it can be a number between 0 and 1.

These oscillators are not only used to generate sound, they are also useful to modulate parameters of these waves. For example, by using `sine` for the width parameter in `pulse`, you can easily modulate the width of the pulse (*pulse width modulation* or PWM). Oscillators with low frequency values are generally used (in the world of synthesis they are called *low frequency oscillators* or simply LFOs).

```javascript
// PWM, in the sine we divide t by 1000
// to make a low frequency sine
o = pulse(t, sine(t/1000))
```

With `//` you can write *comments* in the code. Comments are lines of text that Tilt will ignore when running. Anything after `//` until the end of the line is ignored. They serve to leave notes and clarifications for other coders (or ourselves).

Another waveform known and related to `pulse` is the square wave:

```javascript
o = square(t)
```

It is a particular case of `pulse` but with width 0.5.

We also have the triangle wave, which sounds similar to `sine`:

```javascript
o = tri(t)
```

Finally, a *white noise* wave form, which can be useful for percussive sounds:

```javascript=
o = noise()
```

Note that the latter has no arguments and does not depend on `t`, since for each sample it always generates a random value (technically, a pseudo-random value with uniform distribution is generated).

## Mixing signals

We can add several oscillators in `o`, but we must make sure that the total of the sum does not exceed 1, because distortion could occur.

```javascript
o = sine(t) + saw(t)
```

All the waves generate values between 0 and 1, if we add them directly, values greater than 1 can be produced (in the worst case, in a sample it can happen that both functions generate 1, with which the sum would give 2). It can be solved by dividing both functions by 2:

```javascript
o = sine(t)/2 + saw(t)/2
```

In this way, we would be adding two waves that go from 0 to 0.5, and in the worst case when added they reach 1.

```javascript
// we can also multiply by 0.5
o = sine(t)*0.5 + saw(t)*0.5
```

If there were 3 waves, it would have to be done for 3, and so on.

If a wave sounds too loud or abrasive, you can always multiply or divide it to lower its amplitude and make it softer.

```javascript
// in this case saw sounds lower than sine
o = saw(t) * 0.25 + sine(t) * 0.5
```

## Frequency

We have been using the `t` variable to control the frequency of our oscillators, but there are two more functions that generate values that the oscillators understand and that are more intuitive from a musical point of view:

The function `f` takes a frequency value in Hz. For example, instead of writing `sine(t)`:

```javascript
o = sine(f(440))
```

If one wants to reproduce a specific frequency, this function is easier.

On the other hand, the `m` function takes a MIDI note value. The equivalent would be:

```javascript
// 69 is A4 (440Hz)
o = sine(m(69))
```

With this function you could speak in musical notes (semitones) easily, just using integers:

```javascript
o = sine(m(60))  // C4
o = sine(m(62))  // D4
o = sine(m(63))  // D#4
```

Now that we have the basics for generating waves, let's generate beats with the Sequence and Envelope functions.

## Sequences

Tilt defines a set of functions to change the values of function parameters *sequentially* to generate *beats*. The speed with which the Tilt sequence is given by a special variable `K` (which can also be modified!) and the use of the `%` and `/` functions.

The first function we can see is `seq`. This function generates integer values from 0 to the number we want, at a certain speed. For example:

```javascript
o = tri(t * seq(8, 4))
```

`seq(8, 4)` outputs the values 0, 1, 2 and 3, and starts over, because `length` is 4 (note that it goes from 0 to 3, it's always one less number), and changes value every half second because `subdiv` is 8. If we change `subdiv` to 4, it would change value every second, ie twice as slow; if `subdiv` is 16 it would do it twice as fast.

A more musical example, using `m` instead of `t`:

```javascript
o = tri(m(60 + seq(16, 8)))
```

In this example we are looping through the first 8 notes from C4, going through every semitone.

Another function for sequencing is `aseq`, and this is for sequencing lists of values. For example, we can loop through a list of frequencies:

```javascript
o = tri(f(aseq(8, [440, 330, 660])))
```

or using the `m` function, the notes of the Cmaj7 chord:

```javascript
let cmaj = [60, 64, 67, 71]
o = tri(m(aseq(32, cmaj)))
```

We use this example to show how to define our own variables. `let` defines variables or functions, giving them a name that we can refer to later. In this case we define `cmaj` as a list of numbers (which we know represent the notes of this chord), and use it as a parameter to `aseq`. This is very useful when we want to reuse the same list in several places in the code, since we could later easily modify that list by changing it in only one place. In the [Extensibility](Extensibility) section we will see more examples of defining variables and functions.

The `aseq(subdiv, list)` function takes two parameters, `subdiv` is the speed (idem `seq`), and `list` is a list of values. Depending on where we use `seq`, we will use values that make sense. In the example with `f` it is a list of frequencies in Hz, but in the example of `m` it is a list of MIDI notes.

Lastly, there is the function `seq1`, which is the same as `seq`, but generates numbers starting at 1, instead of starting at 0. Basically it is `seq(subdiv, length) + 1`. There are situations where generating zeros causes problems, and `seq1` is there to avoid typing +1 and putting in extra parentheses.

Let's go back to the following example:

```javascript
o = tri(t * seq(8, 4))
```

There comes a moment during the sequence routine where `seq` outputs a 0 and that's why the sound is muted, `tri(t * 0)` is `tri(0)`, which is 0. We can fix this example using `seq1`:

```javascript
o = tri(t * seq1(8, 4))
```

## Envelope Generators

In synthesis, envelope generators are used to shape the amplitude of sound by changing the amplitude through time. Tilt defines a couple of functions to generate envelopes with an exponential shape:

`env(subdiv, curve, smooth)` generates an envelope that lasts `subdiv`, and curve is a non-negative value (between 0 and infinity), which defines how smooth the curve is. By default curve is 1, and the larger it is, the shorter the curve and the less hard the sound. Values between 0 and 1 generate longer curves.

To use the envelopes, since we want to modify the amplitude of the sound, the most usual thing is to multiply it to the oscillator:

```javascript
o = saw(t) * env(8)
```

The third `smooth` parameter is also optional, it is a number between 0 and 1, and it divides the envelope into a linear ramp and exponential curve, allowing for a smoother attack.

Another envelope function is `invEnv`. It is the same as `env`, but it produces an inverted curve.

```javascript
o = saw(t) * invEnv(8,2)
```

Let's look at a more complex example, using some of the functions you've seen so far:

```javascript
o = pulse(m(aseq(4,[69,60,64,69])) * seq1(aseq(seq1(16,16), [256,128,64,32,16]), 4),
          tri(t/1000)) * env(32,1)
```

There is one more function called `rseq` which is similar to `aseq` and allows you to sequence lists of values but in a random way. We will see it later in the [Randomness](Randomness) section.


## Speed

There is a special variable that controls the speed of everything that sounds in Tilt.

Suppose we have:

```javascript
o = sine(t)
```

If we add the following:

```javascript
o = sine(t)
r = 1.25
```

We notice that the sine seems to be generated at a higher frequency. If we are using sequence functions, the speed of the sequences also changes.

```javascript
o = sine(t) * env(16)

r = 1
// r = 2
// r = 0.5
```

`r` controls the sample rate, which defaults to 1. It makes `t` increase faster at each step.

## Randomness

Tilt has some basic functions to generate random numbers. These functions are also *sequential*, that is, they take `subdiv` as their first parameter, just like `seq` and derivatives.

The first we'll look at is `rand`, which generates numbers between 0 and 1.

```javascript
o = sine(t * rand(32))
```

This example generates a sine of frequencies between 0 and 440 Hz randomly.

`rand(subdiv, seed)` takes two parameters, `subdiv` is the speed (idem `seq`), and `seed` is the *seed*, which is a non-negative integer. Tilt's random number generator always generates the same sequence of numbers, but `seed` allows you to choose a different sequence. This gives us the possibility to use the same random sequence in several places (using the same `seed`), and vary it whenever we want.

The second function is `randInt`, which generates random integers. This is useful for parameterizing integers, such as MIDI notes or indexes in note lists.

```javascript
o = sine(t * randInt(32,8)) 
```

In this case `randInt` is generating values between 0 and 7 randomly with speed 32.

The `rseq` function is similar to `aseq`, but uses `randInt` to access the elements of the list. Allows a list of values to be sequenced randomly.

For example, the following example generates notes of the major scale with `rseq`

```
o = sine(m(rseq(32, [60, 62, 64, 65, 67, 69, 71, 72])))
```

## Modulation

This section is based on and adapted from the [SuperCollider Synthesis tutorial by Nick Collins](https://composerprogrammer.com/teaching/supercollider/sctutorial/tutorial.html).

In modulation synthesis, one wave, the **carrier**, is influenced or modulated by a second wave, the **modulator**.

Depending on how the carrier and modulator are connected, there are several methods in use.

### RM: Ring Modulation

Ring Modulation (RM) is the multiplication of both signals: `carrier * modulator`. For example:

```javascript
o = sine(t) * sine(t/2)
```

### AM: Amplitude Modulation

Amplitude Modulation (AM) is practically the same as RM, but the amplitude of the modulator is between 0.5 and 1, because when it becomes an output signal, it ends up being only positive (unipolar: between 0 and 1, instead of bipolar: between -1 and 1).

```javascript
// multiply by 0.25 and add by 0.75, for the amplitude of the output signal oscillates between 0.5 and 1.
o = sine(t) * (sin(t/100)*0.25+0.75)
```

In music theory, this effect is also called *tremolo*.

### FM: Frequency Modulation

Instead of connecting the modulator to the carrier amplitude, we are going to connect it to the carrier *frequency*. We can think of 3 parameters, the carrier frequency `cfreq`, the modulation frequency `mfreq`, and the modulation depth.

```javascript
let cfreq = f(440);
let mfreq = f(200);
let depth = tri(t/5000) * 100;

o = sine(cfreq + (depth * sine(mfreq)));
```

`depth` allows you to quickly adjust the modulation frequency.

When we use lower `mfreq` values, an effect known as *vibrato* occurs:

```javascript
let cfreq = f(440);
let mfreq = f(4);
let depth = 4;

o = sine(cfreq + (depth * sine(mfreq)));
```

Unlike *tremolo*, this slowly modulates the pitch (frequency) of the signal, rather than its amplitude.

## Extensibility

In Tilt you can write custom variables and functions, to reuse code snippets and add new functionality.

To see a concrete example of using variables, let's explore an example of basic harmony and note pattern sequencing.

```javascript
o = tri(m(60)) * env(16)
```

In this example, the same note is always sounding, C4 (middle C). Now, let's say we want to make a melody within the C major scale.

```javascript
o = tri(m(aseq(16, [60, 62, 64, 58])) * env(16)
```

We can rewrite the list of MIDI notes by taking a root note, let it be 60, and adding a list of relative notes:

```javascript
o = tri(m(60 + aseq(16, [0, 2, 4, -2])) * env(16)
```

The advantage is that now we can only modify the value 60, and just by changing that number we can *transpose* the entire melody.

```javascript
o = tri(m(57 + aseq(16, [0, 2, 4, -2]))) * env(16)
```

And we can define the root in a variable, to reuse it in other waves:

```javascript
let root = 60

o = tri(m(root + aseq(16, [0, 2, 4, -2]))) * env(16) * 0.5
o += sine(m(root - 12 + aseq(4, [0, -2]))) * env(4,0.5) * 0.5
```

We can not only assign a note to `root`, we can use the sequence or random functions that generate integers:

```javascript
// Now the root passes between C4 and C5 (it goes up an octave, that is 12 semitones, since 72 = 60 + 12)
let root = aseq(2, [60, 72])

o = tri(m(root + aseq(16, [0, 2, 4, -2]))) * env(16) * 0.5
o += sine(m(root - 12 + aseq(4, [0, -2]))) * env(4,0.5) * 0.5
```

But we can also define the concept of octaves, knowing that the root can be calculated:

```javascript
// root se calcular a traves de octave, pues cada octava son 12 semitonos
let octave = aseq(2, [5, 6])
let root = octave * 12

o = tri(m(root + aseq(16, [0, 2, 4, -2]))) * env(16) * 0.5
o += sine(m(root - 12 + aseq(4, [0, -2]))) * env(4,0.5) * 0.5
```

We can define scales and work with the concept of degrees, to define a melody in degrees and change the scale sequentially:

```javascript
// Scales
let major = [0, 2, 4, 5, 7, 9, 11];
let minor = [0, 2, 3, 5, 7, 8, 10];

// Base octave
let octave = 5;

// Function that converts degrees to MIDI notes from the base octave
let deg2note = (sc, degree) => ((octave + Math.floor(degree / sc.length)) * 12) + sc[degree % sc.length];

// A melody in degrees, which are the indices within the scale
let degrees = [0, 2, 3, 6];

let melo = aseq(2, [ 
  deg2note(major, aseq(32, degrees)),
  deg2note(minor, aseq(32, degrees))
]);

o = tri(m(melo + aseq(16, [0,7,12,7]))) * env(32,1)
```
