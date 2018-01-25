---
layout: single
title:  "INSTALAR ECLIPSE + WINAVR + HOLAAVR"
date:   2018-01-25 17:09:45 +0100
categories: iot
tags: avr eclipse iot
---

Hace  un tiempo estuve mirando las diferentes herramientas de desarrollo que podía utilizar para desarrollar proyectos con microcontroladores AVR & arduino.

El [arduino IDE][url-arduino-ide] me parecio una herramienta muy amigable y concebida para proyectos 'simples'. Proyectos que no necesiten estructurar el código en diferentes librerías y archivos, si a priori ese va a ser tu escenario podrás empezar a utilizarlo sin ningún tipo de problema.  Descargar, seleccionar el puerto en el que esta conectado arduino, el modelo de arduino que estamos utilizando, escribir el codigo de tu sketch, compilarlo y subirlo. En resumen fácil y sencillo.

Pero si quieres hacer proyectos con más enjundia, mi recomendación es utilizar un IDE más potente,capacidad de gestionar varios proyectos al mismo tiempo, shortcuts,  integración con herramientas de control de versiones (git), asistentes de código,  etc. 

Aunque Microchip tiene una potente herramienta gratuita que es el [Atmel Studio][url-atmelstudio-ide] y es la que personalmente  recomiendo. Sobre todo a los que ya estan familiarizados a utilizar Visual Studio, ya que Atmel Studio es una 'Shell Isolated' de Visual studio, por lo que ya tendreis bastante aprendido.

También existen otras opciones ,como [Eclipse C/C++][url-eclipse-ide]. Un poderoso  y conocido IDE  gratuito, con gran cantidad de plugins aportados por la comunidad. Afortunadamente uno de ellos nos brinda la integración de eclipse con el compilador de AVR  :).

Asi que por estos motivos  me decidi probar este IDE, aunque actualmente utilizo Atmel Studio, mi experincia fue positiva, asi que queria compatirlo con vosotros. 

Una vez hechos los honores vamos al turrón.

<strong>Instalación</strong>

Os detallo los pasos a seguir:

1- [Descargar][url-eclipse-download] & instalar Eclipse IDE la version C/C++, en mi caso la ultima version era Eclipse-neon.  Yo escogí la versión sin instalador de este modo basta con descomprimir el archivo.

2- Descargar e instalar el compilador [AVR para windows][url-winavr-download].

3- Si no la teneis ya, deberéis descargaros la versión de java que sea compatible para la versión de eclipse que os habeis descargado, no hace falta que se el SDK sino el JRE (Java runtime Environment) o maquina virtual Java, en mi caso Jre1.8.0_121. Os preguntaréis como sabeis si necesitais instalar java,sencillo ejecutar eclipse y en caso que tengais una versión obsoleta os avisará.

4- Instalamos el plugin AVR para eclipse, Abrimos eclipse por primera vez , indicamos el directorio de trabajo y nos dirigimos al menu.
(Help > Software Updates > Find and install... > "Search for new features to install" -> "New Remote Site")

![Menu plugins]({{ "/assets/img/eclipse-menu.png" | absolute_url }})


{:.notice--info}
Añadimos el siguiente sitio:<br/><br/>
Name:AVR Eclipse Plugin<br/>
URL:http://avr-eclipse.sourceforge.net/updatesite/<br/>


![Menu plugins]({{ "/assets/img/eclipse-plugin.png" | absolute_url }})


Aceptamos, seleccionamos el plugin y pulsamos siguiente.Una vez instalado nos pedira reiniciar.

<strong>Enhorabuena!!</strong> Ya tenemos todo instalado, has sido facil. Ahora podemos empezar a compilar codigo para AVR, todavia no para arduino para ello tenemos que compilar el core de arduino que lo explicaré en el siguiente post. 


<h3>HolaAVR</h3>

Vamos a crear un par de proyectos muy simples para que podais comprobar como se crea una libreria estatica y se referencia desde el proyecto que vamos a subir a nuestro microcontrolador. Abrimos eclipse y nos dirigimos al menu

<strong>File > New > C++ Project</strong>

Vemos que hay dos tipos de proyectos relativos a AVR diferentes:

<strong>AVR Cross Target Application</strong>, con este tipo de proyectos vamos a crear el binario que grabaremos en nuestro microcontrolador.

<strong>AVR Cross Target Static Library</strong>, este proyecto es para utilizarlo como una libreria estatica y de este modo poder reutilizar nuestras librerias o las de terceros en los diferentes proyectos que vayamos realizando.

 Seleccionamos el tipo de proyecto AVR Cross Target Application, lo llamamos HolaAVR, vemos que en el arbol de proyectos nos aparece un proyecto vacio,  Seleccionamos el nodo del proyecto, boton derecho , del menu emergente escogemos <strong>New > Source File</strong> Le indicamos como nombre main.c.  Y escribimos el codigo más simple posible 

{% highlight c linenos %}
#include <avr/io.h>
#include <util/delay.h>
 
int main( void )
{
}
{% endhighlight %}

Ahora seleccionamos el proyecto pulamos boton derecho del ratón y del menu seleccionamos Build para compilar la aplicacion, vemos que se ha generado dentro del proyecto una carpeta Binaries, que contiene el archivo HolaAVR.elf . Este rrrrrr

Ahora creamos del mismo modo la libreria estatica, pero en este caso seleccionando como tipo de proyecto AVR Cross Target Static Library. Elegimos el nombre HolaLib. Se creara otro proyecto vacio en el arbol de proyectos, agregamos un nuevo archivo pero esta vez en lugar de main.c , escogemos el nombre de la clase HolaClass, deseleccionamos el constructor y destructor y aceptamos. Se crearan en el proyecto los archivos HolaClass.h y HolaClass.cpp.
 
 ![Hola Class]({{ "/assets/img/eclipse-class.png" | absolute_url }})

Añadimos un metodo a la clase tanto en la cabecera como en la implementacion.

<strong>Cabecera:</strong>
{% highlight c++ linenos %}
/*
 * HolaClass.h
 *
 *  Created on: 7 feb. 2017
 *      Author: Admin
 */
 
#ifndef HOLACLASS_H_
#define HOLACLASS_H_
 
class HolaClass {
 
    //definicion de metodos
public:
    void HolaEclipseAVR();
};
 
#endif /* HOLACLASS_H_ */
{% endhighlight %}


<strong>Implementación:</strong>
{% highlight c++ linenos %}
/*
 * HolaClass.cpp
 *
 *  Created on: 7 feb. 2017
 *      Author: Admin
 */
 
#include "HolaClass.h"
 
 
 
void HolaClass::HolaEclipseAVR()
{
    //Implementacion aqui
}
{% endhighlight %}

Ahora compilamos la libreria. Veremos que dentro de la carpeta Debug del proyecto se crea el archivo libHolaLib.a. 
Este archivo es la libreria que vamos a referenciar desde nuestro proyecto de aplicacion, para ello seleccionamos el proyecto HolaAVR, boton derecho y selecionamos Propiedades. 

Se mostrara la ventana de propiedades del proyecto. Aqui podremos configurar lo que atañe a los compiladores de ensamblador, C , C++ y el linker.

![Eclipse Settings]({{ "/assets/img/eclipse-settings.png" | absolute_url }})


Sobre la entrada AVR, vemos que hay dos opciones , si la seleccionamos podemos ver las distintas posibilidades que nos brindan.
<strong>AVRDude</strong>: desde aqui podemos configurar avrdude que es el ejecutable encargado de subir el codigo compilado a nuestro microcontrolador usando el programador o el bootloader instalado en el microcontrolador.
<strong>Target Hardware</strong>: Podemos escoger el modelo del microcontrolador que estamos desarrollando y el cristal de este modo el compilador usa los defines adecuados para compilar el codigo.

Sobre la entrada <strong>C/C++ Build -> Settings</strong> vamos a indicar al compilador de C (AVR Compiler)y C++(AVR C++ Compiler) de que directorio tiene que coger el .h donde se define nuestra clase para poder utilizarla desde nuestro programa. Para ello vamos a <strong>AVR Compiler -> Directories</strong> , seleccionamos el boton de añadir y elegimos del Workspace el proyecto HolaLib tal y como aparece en la imagen y aceptamos.
Repetimos el proceso para <strong>AVR C++ Compiler</strong>

![Eclipse Settings]({{ "/assets/img/eclipse-settings2.png" | absolute_url }})


Con esto le hemos dicho al compilador de C que vamos a referenciar cabeceras del proyecto HolaLib, si vamos al proyecto HolaAVR y miramos en el directorio de includes podremos ver la referencia al proyecto HolaLib.
Ahora editamos el archivo main.c, lo primero que vamos a hacer es cambiarlo de nombre a main.cpp, este paso es importante ya que si la extensión es .c el compilador que se lanza es el de C y no el de C++ y nos dará error de compilación cuando incorporemos la clase a nuestro programa.
Ahora modificamos el archivo main.cpp de tal modo:

{% highlight c++ linenos %}
#include <avr/io.h>
#include <util/delay.h>
#include <HolaClass.h>
 
int main( void )
{
 
    HolaClass miClase;
    miClase.HolaEclipseAVR();
}
{% endhighlight %}


Vemos que al instanciar la clase el editor nos propne los metodos a utilizar en la clase:

![Eclipse Settings]({{ "/assets/img/eclipse-intellisense.png" | absolute_url }})

Ahora compilamos el proyecto, pero tenemos algún error. Vemos en las pantallas de Consola y Problemas lo que ocurre.

![Eclipse Settings]({{ "/assets/img/eclipse-linker_error.png" | absolute_url }})


En realidad no es un error de compilación es de linker. Esto es porque en las settings del proyecto indicamos los directorios a los compiladores , pero no al linker. Volvemos a las propiedades del proyecto. Vamos a <strong>C/C++ Build > Settings</strong> y en el apartado del Linker en libraries indicamos el nombre de la libreria tal y como se llama el proyecto, y en el path de la libreria le indicamos el path donde se ha compilado nuestra libreria , el archivo libHolaLib.a dentro de la carpeta Debug.

![Eclipse Settings]({{ "/assets/img/eclipse-linker.png" | absolute_url }})


Una vez hecho esto volvemos a compilar el proyecto y..... VICTORIA.

{% highlight debug %}
Device: atmega16

Program: 158 bytes (1.0% Full)
(.text + .data + .bootloader)

Data: 0 bytes (0.0% Full)
(.data + .bss + .noinit)


Finished building: sizedummy

22:16:59 Build Finished (took 1s.31ms)
{% endhighlight %}

En el próximo post, compilaremos el core de arduino  como una libreria estatica lo referenciaremos a nuestro proyecto y haremos un pequeño proyecto que subiremos a nuestro arduino.

Happy coding! 

[url-arduino-ide]: http://www.arduino.org/downloads
[url-eclipse-ide]: http://www.eclipse.org/
[url-atmelstudio-ide]: https://www.microchip.com/avr-support/atmel-studio-7
[url-eclipse-download]: https://www.eclipse.org/downloads/packages/
[url-winavr-download]: https://sourceforge.net/projects/winavr/