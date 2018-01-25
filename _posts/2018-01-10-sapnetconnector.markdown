---
layout: single
title:  "SAP + .Net = SAPNetConnector"
date:   2018-01-10 17:09:45 +0100
categories: sap .net
tags: sap .net sapnetconnector bapi
---
En mi trabajo utilizamos SAP R3 como ERP corporativo para los procesos de fabricación y en multiples ocasiones tenemos que conectar a SAP para realizar llamadas a funciones RFC (Remote function call) , bien sean las funciones estandares que SAP trae o alguna funcion Z hecha a medida. De este modo podemos integrar aplicaciones locales con nuestro ERP.

SAP proporciona un conector para ello llamado SAP Connector cuya misión es proporcionar un API para conectar desde .Net a sistemas SAP, el conector se puede descargar desde la marketplace de SAP, pero para ello deberéis tener una cuenta. Una vez descargado el SAP connector podremos conectarnos a sap siguiendo los siguientes pasos. No obstante aqui os dejo un [enlace de descarga][sapconnector-download].

<strong>Configurando la conexión<strong>


Una vez instalado el conector, en nuestro proyecto de .Net hay que agregar las referencias a las librerias de SAPNetConnector. 

Para ello vamos al directorio de instalación de SAP Connector en mi caso C:\Program Files (x86)\SAP ,en función de la arquitectura configurada nuestro proyecto elegiremos el directorio SAP_DotNetConnector3_X64 o SAP_DotNetConnector3_X86 y referenciaremos las librerias sapnco.dll, sapnco_utils.dll

![Directorio install]({{ "/assets/img/sap_install.png" | absolute_url }})

Ahora configuramos el App.config o Web.config en función del tipo de proyecto que estemos. Añadimos la entrada SAP.Middleware.Connector en el configSections y su correspondiente entrada definiendo los destinations de los diferentes sistemas sap a los que nos queremos conectar.

Ejemplo app.config:
{% highlight xml linenos %}
<?xml version="1.0"?>
<configuration>
   
   <!-- SAP.Middleware.Connector -->
    <configSections>
      <sectionGroup name="SAP.Middleware.Connector">
        <sectionGroup name="ClientSettings">
          <section name="DestinationConfiguration" type="SAP.Middleware.Connector.RfcDestinationConfiguration, sapnco"/>
        </sectionGroup>
      </sectionGroup>
    </configSections>
 
 
    <!-- SAP Connection Settings-->
    <SAP.Middleware.Connector>
      <ClientSettings>
        <DestinationConfiguration>
          <destinations>
          <!-- Definir destinos -->
            <add NAME="SAP_TEST" USER="USERSAP" PASSWD="XXXX" CLIENT="MANDANTE" LANG="ES" ASHOST="SERVERTEST.miempresa.com" SYSNR="00" MAX_POOL_SIZE="10" IDLE_TIMEOUT="600"/>
            <add NAME="SAP_PROD" USER="USERSAP" PASSWD="XXXX" CLIENT="300" LANG="ES" ASHOST="SERVERPROD.miempresa.com" SYSNR="00" MAX_POOL_SIZE="10" IDLE_TIMEOUT="600"/>
          </destinations>
        </DestinationConfiguration>
      </ClientSettings>
    </SAP.Middleware.Connector>
 
  <!-- Habilitamos posibilidad de cargar ensamblados antiguos-->
  <startup useLegacyV2RuntimeActivationPolicy="true">
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.0"/>
  </startup>
   
  <runtime>
    <NetFx40_LegacySecurityPolicy enabled="true"/>
  </runtime>
     
  </configuration>
{% endhighlight %}


Logicamente tendriamos que sustituir las variables apropiadas para cada destination,  si nos vamos a SAP Logon y editamos la entrada podemos visualizar los detalles de las conexiones que tenemos configuradas.

![SAP logon details]({{ "/assets/img/sap_logon.png" | absolute_url }})

<strong>Probando el conector<strong>

Para probar el conector he creado un programa de consola muy básico para comprobar que todo funciona correctamente ,  que llama a la BAPI  'BAPI_COMPANY_GETDETAIL'  que obtiene el nombre de la compañia desde el Modulo FI. Estos son los pasos a seguir:

1- Crear proyecto de consola SAPConnectorTest.

2- Referenciar las librerias anteriormente mencionadas (sapnco.dll, sapnco_utils.dll).

3- Añadir el archivo  App.config , configurando el SAP.Middleware.Connector con vuestros parametros de conexión, tal y como vimos al inicio de este artículo.

4- Buscar bapi a ejecutar, en mi caso me conecto al sistema SAP, ejecuto la transacción BAPI y la busco, una vez que tengo identificada la función que es, ejecuto la transacción SE37 y accedo a visualizar. 

![Se37]({{ "/assets/img/se37_sap.png" | absolute_url }})

5-Verifico que esa función puede ser llamada remotamente, para ello en la pestaña atributos veo que esta activado 'Módulo de acceso remoto' , todas las BAPI's lo tienen activo.

![Se37 atributos]({{ "/assets/img/se37_attributo.png" | absolute_url }})

6-Verifico los parametros de entrada  para poder realizar la llamada correctamente a dicha función, compruebo que tiene el parametro COMPANYID navegando através del tipo veo que el parametro 'primitivo' de entrada es un CHAR(6).

![Se37 parametros]({{ "/assets/img/bapi_import.png" | absolute_url }})

7-Del mismo modo verifico los parametros de salida 'Export' , veo que hay dos estructuras de salida. la funcion no tiene parametros de referencia , pestaña Modif, ni devuelve tablas, pestaña 'Tablas'.

![Se37 parametros]({{ "/assets/img/bapi_export.png" | absolute_url }})

8-Ejecuto un test de la función, para ello hago click sobre el boton de la barra de herramientas ![Se37 parametros]({{ "/assets/img/bap_test_btn.png" | absolute_url }}). Me aparecera una pantalla donde puedo introducir los parametros de entrada de la función, en este caso COMPANYID. Introduzco el parametro de entrada, en este caso debe ser el codigo de la Sociedad GL, y ejecuto la función ![Se37 parametros]({{ "/assets/img/bapi_execute.png" | absolute_url }}).

![Se37 parametros]({{ "/assets/img/test_bapi.png" | absolute_url }})

9-Obtengo el resultado de ejecutar la función con ese parametro, en el caso que la función devuelva estructuras o tablas puede navegar por ellas.

![Se37 parametros]({{ "/assets/img/bapi_result.png" | absolute_url }})

Ahora que ya hemos comprobado con que parametros debemos llamar a la función, vamos a hacer lo mismo desde nuestro codigo .Net utilizando la API de SAPNetConnector

{% highlight xml linenos %}
using System;
using System.Collections.Generic;
using System.Text;
using SAP.Middleware.Connector;
 
namespace SAPConnectionTest
{
    class Program
    {
        static void Main(string[] args)
        {
            System.Console.WriteLine("Introduzca codigo de compañia:");
            string company = System.Console.ReadLine();
            string name = GetCompanyName(company);
            System.Console.WriteLine(string.Format("Nombre Compañia: {0}", name));
            System.Console.ReadKey();
        }
 
 
        public static string GetCompanyName(string companyID)
        {
            string companyName = null;
 
                //Obtenemos la conexion definida en el config
                RfcDestination _destinationSAP = RfcDestinationManager.GetDestination("SAP");
                //Inicializamos el contexto de la llamada
                RfcSessionManager.BeginContext(_destinationSAP);
                //Obtenemos la funcion
                IRfcFunction companyAPI = _destinationSAP.Repository.CreateFunction("BAPI_COMPANY_GETDETAIL");
                //Fijamos el parametro
                companyAPI.SetValue("COMPANYID", companyID);
                //Invocamos la funcion
                companyAPI.Invoke(_destinationSAP);
                //Obtenemos la estructura que devuelve la funcion
                IRfcStructure _companyDetail = companyAPI.GetStructure("COMPANY_DETAIL");
                //Obtenemos el campo NAME
                companyName = _companyDetail.GetString("NAME1");
                //Si es null lanzamos excepcion
                if (string.IsNullOrEmpty(companyName)) throw new Exception(string.Format("No se encontro la compañia con codigo {0}", companyID));
                //Finalizamos el contexto de la llamada
                RfcSessionManager.EndContext(_destinationSAP);
 
        
 
            return companyName;
        }
    }
}
{% endhighlight %}



<strong>Algunos apuntes</strong>

Para consultar las funciones BAPI disponibles en SAP podeis ejecutar la transacción BAPI , las BAPI son funciones estandares de SAP que han sido creadas y probadas por SAP, tienen muchas funciones habituales, crear pedidos, ordenes de proceso, materiales etc, etc,. 
En las BAPIS que graban datos, para confirmar esos cambios hay que realizar una llamada a la BAPI BAPI_TRANSACTION_COMMIT.

Si no encontrais la BAPI que necesitais siempre podeis crear funciones personalizadas con código ABAP, llamadas 'Z'  y desde la transacción SE37 y habilitarlas para que sean accesibles de forma remota. De este modo siempre podreis ajustar SAP a vuestras necesidades.

Desde la transacción SE37 también podeis depurar las funciones y ejecutar test de las mismas.

Happy Coding!


[sapconnector-download]: https://drive.google.com/file/d/0ByF7CReb2zYUUDJFNF91UzdoaVk/view?usp=sharing
