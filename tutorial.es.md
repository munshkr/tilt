# Tutorial (es)

## Índice

1. [Introducción](#Introducción)
2. [Variables y formas de ondas básicas](#Formas-de-onda)
	- Ondas: `sine`, `saw`, `square`, `pulse`, `triangle`, `noise`
	- Variables: `t`, `o`
3. [Mezcla: cómo sumar señales](#Mezcla)
4. [Frecuencia: `f`, `m`](#Frecuencia)
5. [Secuencias: `seq`, `seq1`, `aseq`, `rseq`](#Secuencias)
6. [Envolventes: `env` , `invEnv`](#Envolventes)
7. [Velocidad: `r`](#Velocidad)
8. [Aleatoriedad: `rand`, `randInt`](#Aleatoriedad)
9. [Modulación: RM, AM y FM](#Modulación)
10. [Extensibilidad: Armonía básica con escalas y grados](#Extensibilidad)

## Introducción

**Tilt** es un entorno de live coding para hacer **síntesis de sonido en tiempo real**. Está programado en JavaScript y corre en navegadores, tanto de escritorio como en teléfonos celulares (testeado en Chrome, Firefox y Safari).

Como sucede a menudo en la escena de live coding, es un software experimental y a veces puede tener errores y fallar, aunque generalmente recargando la página se puede recuperar. Tilt siempre guarda lo último escrito, por lo que basta con recargar la página para recuperarlo.

Empecemos escribiendo la siguiente línea de código:

```javascript
o = sine(t)
```

Para crear sonido en Tilt, tenemos que definir la *variable* `o`. Esta es la variable de salida, que determina que es lo que sonará por la placa de sonido y por los parlantes. Debe ser un número entre 0 y 1. En este caso estamos definiéndola con `sine()`, que es una *función* que genera una onda sinusoidal, y su argumento en este caso es `t`. `t` es una variable de lectura que se incrementa continuamente, y junto con ciertas funciones matemáticas permite generar ondas periódicas, que son las que "suenan".

`t` por defecto va incrementándose a una velocidad tal que `sine(t)` genere una onda a 440 Hz (A4). Si dividimos `t` por 2 en el argumento de `sine`, iría a la mitad de velocidad (220Hz). En términos musicales, estaríamos sonando una octava abajo. Lo contrario sucede si multiplicamos por 2 (880Hz, una octava arriba). Se puede multiplicar o dividir por números decimales también, y eso generaría microtonos, pero no entraremos en detalle.

## Formas de onda

Además del seno, Tilt tiene definidas otras formas de onda que se pueden usar como osciladores:

`saw(t)` es la forma de onda *diente de sierra* (*sawtooth* en inglés)

```javascript
o = saw(t)
```

`pulse(t, width)` es la forma de onda de *pulso*. Esta función acepta dos parámetros, el primero es la frecuencia, y el segundo, `width` es el ancho del pulso activo, puede ser un número entre 0 y 1.

Estos osciladores no sólo sirven para generar sonido, también son útiles para modular parámetros de estas ondas. Por ejemplo, usando `sine` para el parámetro `width` en `pulse`, se puede fácilmente modular el ancho del pulso (*pulse width modulation*, PWM). Generalmente se utilizan osciladores con valores de frecuencia bajos (en el mundo de síntesis se llaman *low frequency oscillators* o simplemente LFOs).

```javascript
// PWM, en el sine dividimos t por 1000 
// para hacer un seno de baja frecuencia
o = pulse(t, sine(t/1000))
```

Con `//` se pueden escribir *comentarios* en el código. Los comentarios son líneas de texto que Tilt va a ignorar al ejecutar. Todo lo que se escriba después de `//` hasta que termine la línea se ignora. Sirven para dejar notas y aclaraciones para otros coders (o nosotros mismos).

Otra forma de onda conocida y relacionada a `pulse` es la onda cuadrada:

```javascript
o = square(t)
```

Es un caso particular de `pulse` pero con ancho `0.5`.

Tambíén tenemos la onda triangular, que suena similar a `sine`:

```javascript
o = tri(t)
```

Por último, una onda de ruido blanco o *noise*, que puede ser útil para sonidos percusivos:

```javascript=
o = noise()
```

Notar que esta última no tiene argumentos y no depende de `t`, dado que para cada muestra genera siempre un valor aleatorio (técnicamente, se genera un valor pseudoaleatorio con distribución uniforme).

## Mezcla

Podemos sumar varios osciladores en `o`, pero hay que asegurarse que el total de la suma no supere 1, porque podría producirse distorsión.

```javascript
o = sine(t) + saw(t)
```

Todas las ondas generan valores entre 0 y 1, si las sumamos directamente, pueden producirse valores más grandes que 1 (en el peor caso, en una muestra puede darse que ambas funciones generen 1, con lo cual la suma daría 2). Se puede solucionar dividiendo ambas funciones por 2:

```javascript
o = sine(t)/2 + saw(t)/2
```

De esta manera, estaríamos sumando dos ondas que van de 0 a 0.5, y en el peor caso al sumarse lleguen a 1.

```javascript
// también podemos multiplicar por 0.5
o = sine(t)*0.5 + saw(t)*0.5
```

Si fueran 3 ondas, habría que hacerlo por 3, y así sucesivamente.

Si una onda suena demasiado fuerte o abrasiva, siempre se puede multiplicar o dividir para achicar su amplitud y hacer que suene más bajito.

```javascript
// en este caso saw suena más bajito que sine.
o = saw(t) * 0.25 + sine(t) * 0.5
```

## Frecuencia

Venimos utilizando la variable `t` para controlar la frecuencia de nuestros osciladores, pero hay dos funciones más que generan valores que los osciladores entienden y que son más intuitivos desde un punto de vista musical:

La función `f` toma un valor de frecuencia en Hz. Por ejemplo, en vez de escribir `sine(t)`:

```javascript
o = sine(f(440))
```

Si uno quiere reproducir una frecuencia específica, esta función es más facil.

Por otro lado, la función `m` toma un valor de nota MIDI. El equivalente sería:

```javascript
// 69 es A4 (440Hz)
o = sine(m(69))
```

Con esta función se podría hablar en notas musicales (semitonos) con facilidad, simplemente usando números enteros:

```javascript
o = sine(m(60))  // C4, do, 4ta octava
o = sine(m(62))  // D4, re, 4ta octava
o = sine(m(63))  // D#4, re sostenido, 4ta octava
```

Ahora que tenemos los elementos básicos para generar ondas, vamos a generar ritmos con las funciones de secuencia y envolventes.

## Secuencias

Tilt define un conjunto de funciones para cambiar los valores de los parámetros de las funciones *secuencialmente* y de esta manera generar *ritmos*. La velocidad con la que Tilt secuencia está dada por una variable especial `K` (que también se puede modificar!) y el uso de las funciones `%` y `/` (ver [Apéndice A](#Apéndice-A-Secuenciación-con-módulo) para más información técnica).

La primera función que podemos ver es `seq`. Esta función genera valores enteros del 0 al número que querramos, a cierta velocidad. Por ejemplo:

```javascript
o = tri(t * seq(8, 4))
```

`seq(8, 4)` genera los valores 0, 1, 2 y 3, y vuelve a empezar, porque `length` es 4 (notar que va de 0 a 3, siempre es un numero menos), y cambia de valor cada medio segundo porque `subdiv` es 8. Si cambiamos subdiv a 4, cambiaría de valor cada segundo, es decir al doble de lento; si `subdiv` es 16 lo haría al doble de rápido.

Un ejemplo más musical, usando `m` en vez de `t`:

```javascript
o = tri(m(60 + seq(16, 8)))
```

En este ejemplo estamos recorriendo las primeras 8 notas desde C4, pasando por cada semitono.

Otra función para secuenciar es `aseq`, y esta sirve para secuenciar listas de valores. Por ejemplo, podemos recorrer una lista de frecuencias:

```javascript
o = tri(f(aseq(8, [440, 330, 660])))
```

o usando la función `m`, las notas del acorde Cmaj7:

```javascript
let cmaj = [60, 64, 67, 71]
o = tri(m(aseq(32, cmaj)))
```

Aprovechamos este ejemplo para mostrar cómo definir nuestras propias variables. `let` define variables o funciones, dándoles un nombre al cual podremos referirnos más abajo. En este caso definimos `cmaj` como una lista de números (que sabemos que representan las notas de este acorde), y la usamos como parámetro de `aseq`. Esto es muy util cuando queremos reutilizar la misma lista en varios lugares en el código, dado que luego podríamos modificar esa lista facilmente cambiandola en un sólo lugar. En la sección [Extensibilidad](#Extensibilidad) veremos más ejemplos de definición de variables y funciones.

La función `aseq(subdiv, list)` recibe dos parámetros, `subdiv` es la velocidad (idem `seq`), y `list` es una lista de valores. Dependiendo de dónde usemos `seq`, usaremos valores que tengan sentido. En el ejemplo con `f` es una lista de frecuencias en Hz, pero en el ejemplo de `m` es una lista de notas MIDI.

Por último, existe la función `seq1`, que es igual a `seq`, pero genera números a partir de 1, en vez de empezar por el 0. Basicamente es `seq(subdiv, length) + 1`. Hay situaciones donde generar ceros causa problemas, y `seq1` está para evitar tener que escribir `+ 1` y poner paréntesis extras.

Volvamos al siguiente ejemplo:

```javascript
o = tri(t * seq(8, 4))
```

Hay un momento donde `seq` genera un 0 y es por eso que el sonido se silencia, tri(t * 0) es tri(0), que es 0. Podemos arreglar este ejemplo usando `seq1`:

```javascript
o = tri(t * seq1(8, 4))
```

## Envolventes

Tilt define un par de funciones para generar envolventes exponenciales:

`env(subdiv, curve, smooth)` genera un envolvente que dura `subdiv`, y `curve` es un valor no negativo (entre 0 e infinito), que define que tan ajustada es la curva. Por defecto `curve` es 1, y cuanto más grande, mas corta es la curva y menos dura el sonido. Valores entre 0 y 1 generan curvas más largas.

Para usar las envolventes, dado que queremos modificar la amplitud del sonido, lo más usual es multiplicarlo al oscilador:

```javascript
o = saw(t) * env(8)
```

El tercer parámetro `smooth` también es opcional, es un número entre 0 y 1, y divide el envolvente en una rampa lineal y la curva exponencial, permite generar un ataque más suave.

Otra función de envolventes es `invEnv`. Es igual a `env`, pero genera una curva invertida.

```javascript
o = saw(t) * invEnv(8,2)
```

Veamos un ejemplo más complejo, usando algunas de las funciones vistes hasta ahora:

```javascript
o = pulse(m(aseq(4,[69,60,64,69])) * seq1(aseq(seq1(16,16), [256,128,64,32,16]), 4),
          tri(t/1000)) * env(32,1)
```

Hay una función más llamada `rseq` que es similar a `aseq` y permite secuenciar listas de valores pero de manera aleatoria. La veremos más adelante en la sección [Aleatoriedad](#Aleatoriedad).


## Velocidad

Hay una variable especial que controla la velocidad de todo lo que suena en Tilt. 

Supongamos que tenemos:

```javascript
o = sine(t)
```

Si agregagamos lo siguiente:

```javascript
o = sine(t)
r = 1.25
```

Notamos que el sine parece generarse a una frecuencia más alta.   Si estamos usando funciones de secuencia, la velocidad de las secuencias también cambia.

```javascript
o = sine(t) * env(16)

r = 1
// r = 2
// r = 0.5
```

`r` controla la velocidad de muestreo, que por defecto es 1. Hace que `t` se incremente más rápido en cada paso.

## Aleatoriedad

Tilt posee algunas funciones básicas para generar números aleatorios. Estas funciones también son *secuenciales*, es decir, toman como primer parámetro `subdiv`, al igual que `seq` y derivados.

La primera que veremos es `rand`, que genera números entre 0 y 1.

```javascript
o = sine(t * rand(32))
```

Este ejemplo genera un seno de frecuencias entre 0 y 440Hz de manera aleatoria.

`rand(subdiv, seed)` toma dos parámetros, `subdiv` es la velocidad (idem `seq`), y `seed` es la *semilla*, que es un número entero no negativo. El generador de números aleatorios de Tilt siempre genera la misma secuencia de números, pero `seed` permite elegir una secuencia distinta. Esto nos da la posibilidad de usar la misma secuencia aleatoria en varios lugares (empleando el mismo `seed`), y variarlo cuando querramos.

La segunda función es `randInt`, que genera números aleatorios *enteros*. Esto es util para parametrizar enteros, como notas MIDI o índices en listas de notas.

```javascript
o = sine(t * randInt(32,8)) 
```

En este caso `randInt` está generando valores entre 0 y 7 de manera aleatoria con velocidad 32.

La función `rseq` es similar a `aseq`, pero utiliza `randInt` para acceder a los elementos de la lista. Permite secuenciar una lista de valores de manera aleatoria.

Por ejemplo, el siguiente ejemplo genera notas de la escala mayor con `rseq`

```
o = sine(m(rseq(32, [60, 62, 64, 65, 67, 69, 71, 72])))
```

## Modulación

Esta sección está basada y adaptada del [tutorial de Síntesis en SuperCollider de Nick Collins](https://composerprogrammer.com/teaching/supercollider/sctutorial/tutorial.html).

En síntesis de modulación, una onda, la **portadora** (*carrier*), es influenciada o *modulada* por una segunda onda, la **moduladora**.

Dependiendo de cómo la portadora y la moduladora se conectan, hay varios métodos en uso.

### RM: Modulación de Anillo (*ring modulation*)

Modulación de anillo (RM) es la multiplicación de ambas señales: `carrier * modulator`. Por ejemplo:

```javascript
o = sine(t) * sine(t/2)
```

### AM: Modulación de Amplitud

Modulación de amplitud (AM) es prácticamente igual a RM, pero la amplitud de la moduladora esta entre 0.5 y 1, porque al convertirse en señal de salida, termina siendo sólo positiva (unipolar: entre 0 y 1, en vez de bipolar: entre -1 y 1).

```javascript
// multiplica por 0.25 y suma por 0.75, para la amplitud de la señal de salida oscile entre 0.5 y 1.
o = sine(t) * (sin(t/100)*0.25+0.75)
```

En música este efecto también se llama *tremolo*.

### FM: Modulación de Frecuencia

En vez de conectar la moduladora a la amplitud de la portadora, vamos a conectarla a la *frecuencia* de la portadora. Podemos pensar en 3 parámetros, la frecuencia de la portadora `cfreq`, la frecuencia de modulación `mfreq`, y la profundidad de modulación `depth`.

```javascript
let cfreq = f(440);
let mfreq = f(200);
let depth = tri(t/5000) * 100;

o = sine(cfreq + (depth * sine(mfreq)));
```

Depth permite ajustar rapidamente la frecuencia de modulación.

Cuando usamos valores de `mfreq` más bajos, se produce un efecto conocido como *vibrato*:

```javascript
let cfreq = f(440);
let mfreq = f(4);
let depth = 4;

o = sine(cfreq + (depth * sine(mfreq)));
```

A diferencia del *tremolo*, en este caso se modula lentamente el tono (la frecuencia) de la señal, en vez de su amplitud.

## Extensibilidad

En Tilt se pueden escribir variables y funciones personalizadas, para reutilizar fragmentos de código y agregar nuevas funcionalidades.

Para ver un ejemplo concreto del uso de variables, vamos a explorar un ejemplo de harmonía básica y de secuenciación de patrones de notas.

```javascript
o = tri(m(60)) * env(16)
```

En este ejemplo está sonando siempre la misma nota, C4 (Do central). Ahora, supongamos que queremos hacer una melodía dentro de la escala mayor de Do.

```javascript
o = tri(m(aseq(16, [60, 62, 64, 58])) * env(16)
```

Podemos reescribir la lista de notas MIDI tomando una nota raíz, que sea 60, y sumar una lista de notas relativas:

```javascript
o = tri(m(60 + aseq(16, [0, 2, 4, -2])) * env(16)
```

La ventaja es que ahora podemos modificar solo el valor 60, y con solo cambiar ese número podemos *trasponer* toda la melodía.

```javascript
o = tri(m(57 + aseq(16, [0, 2, 4, -2]))) * env(16)
```

Y la raíz la podemos definir en una variable, para reutilizarla en otras ondas:

```javascript
let root = 60

o = tri(m(root + aseq(16, [0, 2, 4, -2]))) * env(16) * 0.5
o += sine(m(root - 12 + aseq(4, [0, -2]))) * env(4,0.5) * 0.5
```

A `root` no sólo podemos asignarle una nota, podemos usar las funciones de secuencia o aleatorias que generen números enteros:

```javascript
// Ahora la raiz pasa entre C4 y C5 (sube una octava, es decir 12 semitonos, pues 72 = 60 + 12)
let root = aseq(2, [60, 72])

o = tri(m(root + aseq(16, [0, 2, 4, -2]))) * env(16) * 0.5
o += sine(m(root - 12 + aseq(4, [0, -2]))) * env(4,0.5) * 0.5
```

Pero también podemos definir el concepto de octavas, sabiendo que la raíz la podemos calcular:

```javascript
// root se calcular a traves de octave, pues cada octava son 12 semitonos
let octave = aseq(2, [5, 6])
let root = octave * 12

o = tri(m(root + aseq(16, [0, 2, 4, -2]))) * env(16) * 0.5
o += sine(m(root - 12 + aseq(4, [0, -2]))) * env(4,0.5) * 0.5
```

Podemos definir escalas y trabajar con el concepto de grados, para definir una melodía en grados e ir cambiando la escala secuencialmente:

```javascript
// Escalas
let major = [0, 2, 4, 5, 7, 9, 11];
let minor = [0, 2, 3, 5, 7, 8, 10];

// Octava base
let octave = 5;

// Funcion que convierte grados a notas MIDI desde la octava base
let deg2note = (sc, degree) => ((octave + Math.floor(degree / sc.length)) * 12) + sc[degree % sc.length];

// Una melodía en grados, que son los índices dentro de la escala
let degrees = [0, 2, 3, 6];

let melo = aseq(2, [ 
  deg2note(major, aseq(32, degrees)),
  deg2note(minor, aseq(32, degrees))
]);

o = tri(m(melo + aseq(16, [0,7,12,7]))) * env(32,1)
```
