# Tilt

Bytebeat-inspired live coding thingie for waveshaping synthesis.

Runs on modern browsers using the WebAudio API.

![](https://media.giphy.com/media/lpedpbBcum4QXkGpeR/giphy.gif)


## Usage

To make some audio, define the value of the variable `o`. It must be a number
between 0 and 1.  For this, you can use the `t` parameter, which is an
always-increasing counter.

For example, to make a sine wave at 440hz:

```javascript
o = sine(t)
```

Evaluate code by pressing the Play button, or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>
(or <kbd>Command</kbd>+<kbd>Enter</kbd>). You can stop sound by pressing the
Stop button, or <kbd>Ctrl</kbd>+<kbd>.</kbd>.

You can make all sorts of simple (and more complex) waveforms:

```javascript
// saw wave
let q = 2*pi
o = t%q/q
```

```javascript
// square wave
let q = 2*pi
o = (t%q/q > 0.5)
```

```javascript
// pulse wave with pulse-width modulation
let q = 2*pi
o = (t%q/q > seq(256,64)/64)
```

```javascript
// triangle wave
let ramp = t%q/q
o = (((ramp > 0.5) ? ramp : 1-ramp) - 0.5)*2
```

These simple *waveforms* are also already defined as functions. Read below.

There is also a parameter `K` which is static and represents the number of
samples in a *cycle*. It is used to make *rhythm*. See the function `seq` or
`randInt`, as they use it internally.

A more complex example, using some of the functions described below:

```javascript
o = sine(t/(randInt(8,32)+1)) * env(8,1) * 0.75
o += sine(t/4 + sine(t/2.0001)) * invEnv(seq(16,8), seq(4,8)+1) * 0.75
```


## Functions

Code is written in JavaScript, but there are some useful constants and
functions available.

### Math

Most of the functions from `Math` object in JavaScript are defined as globals,
but the following are the most useful:

* `pi`: Pi constant.
* `two_pi`: 2 times Pi
* `abs(arg)`: Returns the absolute value of a number.
* `sin(arg)`: Returns the sine of a number.
* `tan(arg)`: Returns the tangent value of a number.
* `tanh(arg)`: Returns the hyperbolic tangent value of a number.
* `floor(arg)`: Returns the largest integer less than or equal to a given
  number.
* `ceil(arg)`: Returns the smallest integer greater than or equal to a given
  number.
* `pow(arg)`: Returns base to the exponent power.
* `round(arg)`: Returns the value of a number rounded to the nearest integer.
* `sqrt(arg)`: Returns the positive square root of a number.

Note: `sin` returns a number from -1 to 1, there is also `sine` which
returns a number from 0 to 1, suitable as audio output.

### Waveforms

These functions all return numbers from 0 to 1, so they can be used directly as
audio output.

* `sine(t)`: Sine waveform
* `saw(t)`: Saw waveform
* `pulse(t, width)`: Pulse waveform
* `square(t)`: Square waveform (same as Pulse with width 0.5)
* `triangle(t)`: Triangle waveform

### Sequences

* `seq(subdiv, length)`: Returns a number from 0 to `length` in `subdiv`
  subdivisions of a cycle (defined by `K`).

### Envelopes

* `env(subdiv, curve, smooth)`: Generates an exponential envelope that lasts
  `subdiv` subdivisions of a cycle, with an exponent `curve`. The optional
  `smooth` argument is a 0-1 number that splits the envelope into an increasing
  linear ramp for a smoother attack (0=no smoothing, 1=linear ramp).

* `invEnv(subdiv, curve, smooth)`: Same as `env` but generates an inverse
  exponential envelope. The `smooth` argument controls a decreasing ramp at the
  end of the envelope.

### Random

* `rand(subdiv, seed)`: Returns a random number between 0 and 1. The number is
  held during `subdiv` subdivisions of a cycle. When using the same `seed` you
  can generate the same sequence of random numbers.

* `randInt(subdiv, max, seed)`: Same as `rand` but generates a integer numbers
  from 0 to `max`.


## Acknowledgments

* [Rampcode](https://github.com/gabochi/rampcode)
* [Hydra](https://github.com/ojack/hydra)
* The Computer Music Tutorial (Curtis Roads, 1996)
* bytebeat *technique* in general

## License

GPL 3+. Refer to [LICENSE.txt](LICENSE.txt)

Icons:
* Play by Eagle Eye from the Noun Project
* Stop by vectoriconset10 from the Noun Project
