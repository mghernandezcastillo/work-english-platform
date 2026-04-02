import { brand } from '../../../lib/brand'
import './LegalPage.css'

const YEAR = new Date().getFullYear()

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <button className="legal-back" onClick={() => window.history.back()}>← Volver</button>
        <h1 className="legal-title">🔏 Política de Privacidad y Tratamiento de Datos Personales</h1>
        <p className="legal-meta">
          Última actualización: 2 de abril de {YEAR} · Vigente desde la fecha de compra o registro.
        </p>

        <div className="legal-alert">
          <strong>Aviso legal:</strong> En cumplimiento de la <strong>Ley 1581 de 2012</strong> (Ley de
          Protección de Datos Personales) y el <strong>Decreto 1377 de 2013</strong> de la República de
          Colombia, English for Work informa a sus usuarios sobre el tratamiento que se da a sus datos
          personales.
        </div>

        {/* 1 */}
        <section className="legal-section">
          <h2>1. Responsable del tratamiento</h2>
          <p>
            <strong>English for Work</strong> es la entidad responsable del tratamiento de los datos
            personales recopilados a través de su plataforma digital.
          </p>
          <p>
            Correo de contacto para asuntos de privacidad:{' '}
            <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>
          </p>
        </section>

        {/* 2 */}
        <section className="legal-section">
          <h2>2. Datos personales que recopilamos</h2>
          <p>Recopilamos los siguientes datos personales:</p>

          <h3>2.1 Datos que usted nos proporciona directamente</h3>
          <ul>
            <li><strong>Nombre completo:</strong> para identificación en la plataforma.</li>
            <li><strong>Correo electrónico:</strong> para autenticación, notificaciones y soporte.</li>
            <li><strong>Contraseña:</strong> almacenada de forma encriptada; jamás en texto plano.</li>
          </ul>

          <h3>2.2 Datos que recopilamos automáticamente</h3>
          <ul>
            <li><strong>Progreso de aprendizaje:</strong> lecciones completadas, puntajes y simulaciones.</li>
            <li><strong>Datos de uso:</strong> páginas visitadas, tiempo en plataforma y frecuencia de uso.</li>
            <li><strong>Datos técnicos:</strong> tipo de dispositivo, navegador, sistema operativo, dirección IP.</li>
          </ul>

          <h3>2.3 Datos de pago</h3>
          <p>
            English for Work <strong>no almacena</strong> datos de tarjetas de crédito, débito ni
            información bancaria. Los pagos son procesados exclusivamente por <strong>Hotmart</strong>,
            quien actúa como responsable independiente del tratamiento de datos de pago.
          </p>
        </section>

        {/* 3 */}
        <section className="legal-section">
          <h2>3. Finalidades del tratamiento</h2>
          <p>Sus datos personales son utilizados para las siguientes finalidades:</p>
          <ul>
            <li>Crear y gestionar su cuenta de usuario en la plataforma.</li>
            <li>Prestar el servicio educativo contratado y hacer seguimiento de su progreso.</li>
            <li>Enviar comunicaciones relacionadas con su cuenta (acceso, soporte, seguridad).</li>
            <li>Enviar comunicaciones de marketing y novedades del curso (con posibilidad de cancelar en cualquier momento).</li>
            <li>Mejorar la plataforma mediante análisis de uso (datos anonimizados o agregados).</li>
            <li>Cumplir obligaciones legales y fiscales aplicables en Colombia.</li>
          </ul>
        </section>

        {/* 4 */}
        <section className="legal-section">
          <h2>4. Base legal del tratamiento</h2>
          <p>
            El tratamiento de sus datos personales se basa en:
          </p>
          <ul>
            <li><strong>Ejecución del contrato:</strong> para prestar el servicio que usted adquirió.</li>
            <li><strong>Consentimiento:</strong> para comunicaciones de marketing, el cual puede revocar.</li>
            <li><strong>Interés legítimo:</strong> para análisis de uso y mejora del servicio.</li>
            <li><strong>Obligación legal:</strong> para cumplir con requerimientos fiscales y legales.</li>
          </ul>
        </section>

        {/* 5 */}
        <section className="legal-section">
          <h2>5. Almacenamiento y seguridad</h2>
          <p>
            Sus datos son almacenados en los servidores de <strong>Supabase</strong> (infraestructura
            en la nube con sede en Estados Unidos), con los siguientes controles de seguridad:
          </p>
          <ul>
            <li>Cifrado en tránsito (HTTPS/TLS) y en reposo.</li>
            <li>Autenticación segura con contraseñas encriptadas (bcrypt).</li>
            <li>Políticas de seguridad a nivel de fila (Row Level Security — RLS) en la base de datos.</li>
            <li>Acceso restringido solo al personal autorizado.</li>
          </ul>
          <p>
            Los datos se conservan durante el tiempo que su cuenta esté activa, y hasta 2 años después
            de la cancelación, plazo tras el cual serán eliminados o anonimizados, salvo obligación
            legal de conservación mayor.
          </p>
        </section>

        {/* 6 */}
        <section className="legal-section">
          <h2>6. Transferencia de datos a terceros</h2>
          <p>
            English for Work puede compartir sus datos personales con los siguientes terceros, únicamente
            para las finalidades descritas y con las garantías adecuadas:
          </p>
          <ul>
            <li>
              <strong>Supabase:</strong> proveedor de base de datos e infraestructura. Sus datos se
              almacenan bajo los términos de privacidad de Supabase.
            </li>
            <li>
              <strong>Hotmart:</strong> procesador de pagos. Maneja datos de transacciones bajo sus
              propias políticas.
            </li>
            <li>
              <strong>Brevo (ex-Sendinblue):</strong> plataforma de envío de correos transaccionales.
              Su correo electrónico puede ser transmitido para el envío de comunicaciones del servicio.
            </li>
            <li>
              <strong>Meta (Facebook):</strong> utilizamos el Pixel de Facebook para medir la efectividad
              de campañas publicitarias en nuestra página de inicio. No compartimos datos de usuarios
              registrados con Meta.
            </li>
          </ul>
          <p>
            No vendemos, alquilamos ni cedemos sus datos a terceros con fines comerciales propios.
          </p>
        </section>

        {/* 7 */}
        <section className="legal-section">
          <h2>7. Cookies y tecnologías similares</h2>
          <p>
            La plataforma utiliza las siguientes tecnologías de rastreo:
          </p>
          <ul>
            <li>
              <strong>Cookies de autenticación:</strong> necesarias para mantener su sesión activa.
              Son esenciales y no pueden desactivarse.
            </li>
            <li>
              <strong>Almacenamiento local (localStorage):</strong> para guardar preferencias de
              interfaz (modo oscuro, configuraciones).
            </li>
            <li>
              <strong>Pixel de Facebook:</strong> en las páginas de inicio pública, para medir
              conversiones publicitarias. Puede bloquearlo con extensiones de navegador.
            </li>
          </ul>
        </section>

        {/* 8 */}
        <section className="legal-section">
          <h2>8. Sus derechos como titular de datos (HABEAS DATA)</h2>
          <p>
            De conformidad con la Ley 1581 de 2012, usted tiene derecho a:
          </p>
          <ul>
            <li>
              <strong>Conocer</strong> los datos personales que tenemos sobre usted y el tratamiento
              que les damos.
            </li>
            <li>
              <strong>Actualizar</strong> sus datos si están desactualizados o incorrectos (desde su
              perfil en la plataforma o escribiéndonos).
            </li>
            <li>
              <strong>Rectificar</strong> datos inexactos o incompletos.
            </li>
            <li>
              <strong>Suprimir</strong> ("derecho al olvido") sus datos cuando ya no sean necesarios,
              o cuando retire su consentimiento, salvo casos en que la ley exija su conservación.
            </li>
            <li>
              <strong>Revocar el consentimiento</strong> para comunicaciones de marketing en cualquier
              momento (enlace de cancelación en cada correo o escribiéndonos).
            </li>
            <li>
              <strong>Presentar una queja</strong> ante la Superintendencia de Industria y Comercio
              (SIC) si considera que sus derechos no han sido respetados:{' '}
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer">www.sic.gov.co</a>.
            </li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, escríbanos a{' '}
            <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>. Respondemos dentro de
            10 días hábiles, según lo establecido por la ley.
          </p>
        </section>

        {/* 9 */}
        <section className="legal-section">
          <h2>9. Menores de edad</h2>
          <p>
            English for Work no recopila intencionalmente datos de menores de 18 años. Si usted es
            menor de edad, no debe registrarse ni usar la plataforma sin el consentimiento de su
            padre, madre o tutor legal. Si tenemos conocimiento de que hemos recopilado datos de un
            menor sin el consentimiento requerido, los eliminaremos a la brevedad.
          </p>
        </section>

        {/* 10 */}
        <section className="legal-section">
          <h2>10. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad para reflejar cambios en nuestras prácticas,
            en la ley aplicable o en los servicios. Cualquier cambio sustancial será notificado por
            correo electrónico con al menos <strong>15 días de anticipación</strong>. La versión vigente
            estará siempre disponible en <a href="/politica-privacidad">/politica-privacidad</a>.
          </p>
        </section>

        {/* 11 */}
        <section className="legal-section">
          <h2>11. Contacto y reclamaciones</h2>
          <p>Para cualquier consulta sobre privacidad y datos personales:</p>
          <ul>
            <li>
              Correo: <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>
            </li>
          </ul>
          <p>
            Si no obtiene respuesta satisfactoria, puede acudir a la{' '}
            <strong>Superintendencia de Industria y Comercio (SIC)</strong> como autoridad de
            protección de datos en Colombia.
          </p>
        </section>

        <footer className="legal-footer">
          <p>© {YEAR} {brand.name} · Todos los derechos reservados · Colombia</p>
          <a href="/terminos">Términos y Condiciones</a>
        </footer>
      </div>
    </div>
  )
}
