import { brand } from '../../../lib/brand'
import './LegalPage.css'

const YEAR = new Date().getFullYear()

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <a href="/ingles-para-trabajo" className="legal-back">← Volver al inicio</a>
        <h1 className="legal-title">📄 Términos y Condiciones de Uso</h1>
        <p className="legal-meta">
          Última actualización: 2 de abril de {YEAR} · Aplicable desde la fecha de compra.
        </p>

        <div className="legal-alert">
          <strong>Importante:</strong> Al realizar una compra o crear una cuenta en <strong>English for Work</strong>,
          usted acepta total y expresamente estos Términos y Condiciones. Si no está de acuerdo, no debe
          adquirir ni usar el servicio.
        </div>

        {/* 1 */}
        <section className="legal-section">
          <h2>1. Identificación del prestador del servicio</h2>
          <p>
            <strong>English for Work</strong> es una plataforma educativa digital operada en la República de Colombia.
            Para efectos de estos términos, el término <em>"nosotros"</em>, <em>"la plataforma"</em> o{' '}
            <em>"el prestador"</em> hace referencia a English for Work y sus operadores.
          </p>
          <p>
            Correo electrónico de contacto: <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>
          </p>
        </section>

        {/* 2 */}
        <section className="legal-section">
          <h2>2. Descripción del servicio</h2>
          <p>
            English for Work es un curso de inglés laboral 100% digital, que incluye:
          </p>
          <ul>
            <li>Tres (3) rutas de aprendizaje enfocadas en situaciones laborales reales.</li>
            <li>Lecciones con frases, audio profesional de hablante nativo, y ejercicios interactivos.</li>
            <li>Simulaciones de conversaciones en contextos de trabajo.</li>
            <li>Acceso a la plataforma web desde cualquier dispositivo con internet.</li>
          </ul>
          <p>
            El servicio se presta de manera digital. No se entrega material físico. El acceso es personal
            e intransferible.
          </p>
        </section>

        {/* 3 */}
        <section className="legal-section">
          <h2>3. Precio y forma de pago</h2>
          <p>
            El precio vigente es de <strong>$47.000 COP</strong> (pesos colombianos) por acceso único y
            de por vida al momento de la compra. Este precio puede cambiar en cualquier momento sin previo
            aviso para nuevos compradores; sin embargo, los compradores existentes mantienen el acceso
            ya adquirido.
          </p>
          <p>
            El pago se procesa a través de <strong>Hotmart</strong>, plataforma de pagos tercera. English for Work
            no almacena información de tarjetas de crédito ni datos bancarios. Al pagar, usted acepta también
            los términos de Hotmart disponibles en <a href="https://www.hotmart.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">hotmart.com</a>.
          </p>
          <p>
            El precio incluye todos los impuestos aplicables según la ley colombiana. No hay cargos
            ocultos, mensualidades, ni pagos adicionales por actualizaciones del contenido existente.
          </p>
        </section>

        {/* 4 */}
        <section className="legal-section">
          <h2>4. Acceso y activación</h2>
          <p>
            Una vez confirmado el pago por Hotmart, recibirá un correo electrónico con instrucciones para
            crear su cuenta o acceder a la plataforma. El acceso se activa en un plazo máximo de{' '}
            <strong>24 horas hábiles</strong> luego de la confirmación del pago.
          </p>
          <p>
            Si no recibe acceso en ese plazo, debe escribirnos a{' '}
            <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a> con el comprobante de pago.
          </p>
          <p>
            El acceso es <strong>de por vida</strong>, sujeto a que la plataforma permanezca operativa.
            En caso de cierre de la plataforma, notificaremos con un mínimo de 30 días de anticipación.
          </p>
        </section>

        {/* 5 */}
        <section className="legal-section">
          <h2>5. Garantía de satisfacción — 7 días</h2>
          <p>
            De conformidad con el <strong>Artículo 47 de la Ley 1480 de 2011</strong> (Estatuto del
            Consumidor) y las condiciones de Hotmart, ofrecemos una garantía de satisfacción de{' '}
            <strong>7 días calendario</strong> contados a partir de la fecha de compra.
          </p>
          <p>
            Para hacer válida la garantía, el usuario debe:
          </p>
          <ul>
            <li>Solicitar el reembolso dentro de los 7 días siguientes a la compra.</li>
            <li>Haber consumido <strong>menos del 30% del contenido total</strong> del curso.</li>
            <li>Enviar la solicitud a través del soporte de Hotmart o escribirnos a{' '}
              <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>.</li>
          </ul>
          <p>
            El reembolso se procesa dentro de los plazos establecidos por Hotmart (generalmente 5-10 días
            hábiles). No se realizan reembolsos después de los 7 días ni si se ha consumido más del 30%
            del contenido.
          </p>
        </section>

        {/* 6 */}
        <section className="legal-section">
          <h2>6. Uso permitido y restricciones</h2>
          <p>El acceso a la plataforma es estrictamente <strong>personal e intransferible</strong>. Usted se compromete a:</p>
          <ul>
            <li>No compartir sus credenciales de acceso con terceros.</li>
            <li>No reproducir, distribuir, vender, sublicenciar o publicar el contenido del curso sin autorización escrita.</li>
            <li>No usar herramientas automatizadas (bots, scrapers) para extraer contenido.</li>
            <li>No realizar ingeniería inversa de la plataforma.</li>
            <li>Usar el servicio únicamente para fines educativos personales y legales.</li>
          </ul>
          <p>
            El incumplimiento de estas restricciones faculta a English for Work a suspender el acceso de
            manera inmediata y sin reembolso, pudiendo ejercer las acciones legales correspondientes.
          </p>
        </section>

        {/* 7 */}
        <section className="legal-section">
          <h2>7. Propiedad intelectual</h2>
          <p>
            Todo el contenido de English for Work — incluyendo textos, imágenes, audio, diseño,
            simulaciones y estructura de lecciones — es propiedad exclusiva de English for Work y está
            protegido por las leyes de derechos de autor aplicables en Colombia y los tratados
            internacionales suscritos por Colombia.
          </p>
          <p>
            La compra otorga una <strong>licencia personal, no exclusiva e intransferible</strong> para
            acceder y usar el contenido únicamente con fines educativos personales. No se transfiere ningún
            derecho de propiedad intelectual.
          </p>
        </section>

        {/* 8 */}
        <section className="legal-section">
          <h2>8. Disponibilidad del servicio</h2>
          <p>
            Nos esforzamos por mantener la plataforma disponible 24/7. Sin embargo, no garantizamos disponibilidad
            ininterrumpida. Pueden presentarse interrupciones por mantenimiento, actualizaciones o causas
            de fuerza mayor. En estos casos, no se realizarán reembolsos por interrupciones temporales.
          </p>
          <p>
            En caso de interrupciones prolongadas (más de 72 horas continuas por causas atribuibles a
            nosotros), gestionaremos una solución o compensación adecuada.
          </p>
        </section>

        {/* 9 */}
        <section className="legal-section">
          <h2>9. Limitación de responsabilidad</h2>
          <p>
            English for Work es una herramienta educativa de apoyo. No garantizamos resultados específicos
            tales como conseguir empleo, aumentos salariales o aprobación de entrevistas. Los resultados
            dependen del esfuerzo, constancia y circunstancias individuales de cada usuario.
          </p>
          <p>
            En ningún caso la responsabilidad de English for Work excederá el valor pagado por el usuario
            por el acceso al curso.
          </p>
        </section>

        {/* 10 */}
        <section className="legal-section">
          <h2>10. Modificaciones a los términos</h2>
          <p>
            English for Work se reserva el derecho de modificar estos términos en cualquier momento.
            Las modificaciones serán notificadas por correo electrónico al correo registrado y/o mediante
            un aviso en la plataforma, con al menos <strong>15 días de anticipación</strong> para cambios
            sustanciales. El uso continuado del servicio tras la notificación implica aceptación de los
            nuevos términos.
          </p>
        </section>

        {/* 11 */}
        <section className="legal-section">
          <h2>11. Ley aplicable y resolución de disputas</h2>
          <p>
            Estos Términos y Condiciones se rigen por las leyes de la República de Colombia, en
            particular la Ley 1480 de 2011 (Estatuto del Consumidor), la Ley 527 de 1999 (Comercio
            Electrónico) y demás normativa aplicable.
          </p>
          <p>
            Ante cualquier disputa, las partes se comprometen a intentar una solución amigable en primera
            instancia. Si no es posible, se someterán a los jueces y tribunales competentes de Colombia,
            o al proceso de reclamación ante la Superintendencia de Industria y Comercio (SIC) según
            corresponda.
          </p>
        </section>

        {/* 12 */}
        <section className="legal-section">
          <h2>12. Contacto</h2>
          <p>
            Para cualquier duda, reclamo o solicitud relacionada con estos Términos y Condiciones, puede
            contactarnos en:
          </p>
          <ul>
            <li>Correo electrónico: <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a></li>
          </ul>
          <p>Respondemos dentro de 2 días hábiles.</p>
        </section>

        <footer className="legal-footer">
          <p>© {YEAR} {brand.name} · Todos los derechos reservados · Colombia</p>
          <a href="/politica-privacidad">Política de Privacidad</a>
        </footer>
      </div>
    </div>
  )
}
