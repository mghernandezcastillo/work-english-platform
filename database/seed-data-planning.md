# Seed Data Planning — English for Work

---

## Initial data to insert after schema creation

### Routes (3)

```sql
INSERT INTO public.routes (id, title, description, icon, sort_order) VALUES
  ('route-1', 'Inglés para Conseguir Trabajo', 'Aprende el inglés que necesitas para buscar y conseguir un trabajo mejor.', '💼', 1),
  ('route-2', 'Inglés para Entrevistas', 'Prepárate para responder con seguridad en cualquier entrevista en inglés.', '🎯', 2),
  ('route-3', 'Inglés para Customer Service / Call Center', 'Habla con seguridad con clientes en inglés en cada llamada.', '🎧', 3);
```

### Modules (9)

```sql
INSERT INTO public.modules (id, route_id, title, description, sort_order) VALUES
  -- Route 1
  ('mod-1-1', 'route-1', 'Tu perfil profesional en inglés', 'Aprende a describir tu experiencia y habilidades.', 1),
  ('mod-1-2', 'route-1', 'Aplicar a trabajos en inglés', 'Domina el proceso de aplicación laboral.', 2),
  ('mod-1-3', 'route-1', 'Comunicación profesional básica', 'Comunícate con confianza en el trabajo.', 3),
  -- Route 2
  ('mod-2-1', 'route-2', 'Antes de la entrevista', 'Prepara tus respuestas con las frases clave.', 1),
  ('mod-2-2', 'route-2', 'Durante la entrevista', 'Responde preguntas con seguridad.', 2),
  ('mod-2-3', 'route-2', 'Después de la entrevista', 'Cierra el proceso profesionalmente.', 3),
  -- Route 3
  ('mod-3-1', 'route-3', 'Atención al cliente en inglés', 'Maneja llamadas de principio a fin.', 1),
  ('mod-3-2', 'route-3', 'Resolver problemas en inglés', 'Resuelve casos y maneja clientes difíciles.', 2),
  ('mod-3-3', 'route-3', 'Comunicación en equipo', 'Comunícate con tu equipo en inglés.', 3);
```

### Lessons (36) — IDs only, content added separately

```sql
INSERT INTO public.lessons (id, module_id, title, objective, sort_order) VALUES
  -- Module 1.1
  ('les-1-1-1', 'mod-1-1', 'Cómo describir tu experiencia', 'Vas a poder describir tu experiencia laboral en inglés', 1),
  ('les-1-1-2', 'mod-1-1', 'Frases para tu resumen profesional', 'Vas a poder escribir un resumen profesional básico', 2),
  ('les-1-1-3', 'mod-1-1', 'Habilidades y logros en inglés', 'Vas a poder hablar de tus habilidades y logros', 3),
  ('les-1-1-4', 'mod-1-1', 'Práctica guiada — tu elevator pitch', 'Vas a poder presentarte profesionalmente en 30 segundos', 4),
  -- Module 1.2
  ('les-1-2-1', 'mod-1-2', 'Vocabulario de ofertas laborales', 'Vas a poder entender una oferta de trabajo en inglés', 1),
  ('les-1-2-2', 'mod-1-2', 'Cómo escribir un email de aplicación', 'Vas a poder escribir un email profesional de aplicación', 2),
  ('les-1-2-3', 'mod-1-2', 'Frases para cover letters', 'Vas a poder escribir las partes clave de una cover letter', 3),
  ('les-1-2-4', 'mod-1-2', 'Práctica guiada — responde a una oferta real', 'Vas a poder aplicar a una oferta paso a paso', 4),
  -- Module 1.3
  ('les-1-3-1', 'mod-1-3', 'Saludos y presentaciones formales', 'Vas a poder saludar y presentarte en el trabajo', 1),
  ('les-1-3-2', 'mod-1-3', 'Email profesional básico', 'Vas a poder escribir emails de trabajo profesionales', 2),
  ('les-1-3-3', 'mod-1-3', 'Pedir información y confirmar', 'Vas a poder pedir y confirmar información por escrito', 3),
  ('les-1-3-4', 'mod-1-3', 'Práctica guiada — tu primer día de trabajo', 'Vas a poder comunicarte en tu primer día', 4),
  -- Module 2.1
  ('les-2-1-1', 'mod-2-1', 'Frases clave de entrevistas', 'Vas a conocer las frases más comunes en entrevistas', 1),
  ('les-2-1-2', 'mod-2-1', 'Cómo responder Tell me about yourself', 'Vas a poder responder la pregunta más importante', 2),
  ('les-2-1-3', 'mod-2-1', 'Tus fortalezas y debilidades en inglés', 'Vas a poder hablar de fortalezas y debilidades', 3),
  ('les-2-1-4', 'mod-2-1', 'Práctica guiada — prepara tus respuestas', 'Vas a tener tus respuestas listas', 4),
  -- Module 2.2
  ('les-2-2-1', 'mod-2-2', 'Preguntas comunes y cómo responderlas', 'Vas a poder responder 10 preguntas frecuentes', 1),
  ('les-2-2-2', 'mod-2-2', 'Hablar de experiencia pasada (STAR method)', 'Vas a poder contar historias de éxito con STAR', 2),
  ('les-2-2-3', 'mod-2-2', 'Preguntas sobre salario y beneficios', 'Vas a poder hablar de salario profesionalmente', 3),
  ('les-2-2-4', 'mod-2-2', 'Práctica guiada — simulación de entrevista', 'Vas a poder pasar una entrevista sin quedarte en blanco', 4),
  -- Module 2.3
  ('les-2-3-1', 'mod-2-3', 'Cómo hacer follow-up en inglés', 'Vas a poder hacer follow-up profesional', 1),
  ('les-2-3-2', 'mod-2-3', 'Thank-you email después de la entrevista', 'Vas a poder escribir un email de agradecimiento', 2),
  ('les-2-3-3', 'mod-2-3', 'Negociar una oferta en inglés', 'Vas a poder negociar salario y condiciones', 3),
  ('les-2-3-4', 'mod-2-3', 'Práctica guiada — cierra el proceso', 'Vas a poder cerrar un proceso de selección', 4),
  -- Module 3.1
  ('les-3-1-1', 'mod-3-1', 'Frases de apertura y cierre de llamadas', 'Vas a poder abrir y cerrar llamadas profesionalmente', 1),
  ('les-3-1-2', 'mod-3-1', 'Cómo escuchar y confirmar lo que dice el cliente', 'Vas a poder confirmar que entendiste al cliente', 2),
  ('les-3-1-3', 'mod-3-1', 'Pedir y dar información', 'Vas a poder solicitar y dar información claramente', 3),
  ('les-3-1-4', 'mod-3-1', 'Práctica guiada — tu primera llamada', 'Vas a poder manejar tu primera llamada sin nervios', 4),
  -- Module 3.2
  ('les-3-2-1', 'mod-3-2', 'Vocabulario de problemas comunes', 'Vas a conocer el vocabulario de problemas frecuentes', 1),
  ('les-3-2-2', 'mod-3-2', 'Cómo explicar un proceso o solución', 'Vas a poder explicar soluciones paso a paso', 2),
  ('les-3-2-3', 'mod-3-2', 'Manejar clientes difíciles con calma', 'Vas a poder manejar clientes frustrados con calma', 3),
  ('les-3-2-4', 'mod-3-2', 'Práctica guiada — resuelve un caso', 'Vas a poder resolver un caso completo', 4),
  -- Module 3.3
  ('les-3-3-1', 'mod-3-3', 'Hablar con tu supervisor en inglés', 'Vas a poder comunicarte con tu supervisor', 1),
  ('les-3-3-2', 'mod-3-3', 'Reportar un problema o escalar un caso', 'Vas a poder escalar un caso cuando necesites ayuda', 2),
  ('les-3-3-3', 'mod-3-3', 'Reuniones y updates rápidos', 'Vas a poder participar en reuniones de equipo', 3),
  ('les-3-3-4', 'mod-3-3', 'Práctica guiada — daily standup en inglés', 'Vas a poder dar tu reporte diario en una reunión', 4);
```

### Simulations (12)

```sql
INSERT INTO public.simulations (id, module_id, title, description, sort_order) VALUES
  ('sim-1-1', 'mod-1-1', 'Tu perfil profesional completo', 'Practica presentarte ante un reclutador', 1),
  ('sim-1-2', 'mod-1-2', 'Aplicas a un trabajo y recibes respuesta', 'Vive el proceso de aplicar y recibir respuesta', 1),
  ('sim-1-3', 'mod-1-3', 'Tu primer día en una empresa', 'Simula tu primer día laboral', 1),
  ('sim-2-1', 'mod-2-1', 'Pre-entrevista: prepara tus respuestas', 'Practica antes de tu entrevista', 1),
  ('sim-2-2', 'mod-2-2', 'Entrevista completa para un puesto real', 'Vive una entrevista de inicio a fin', 1),
  ('sim-2-3', 'mod-2-3', 'Del follow-up a la oferta', 'Practica el proceso post-entrevista', 1),
  ('sim-3-1', 'mod-3-1', 'Tu primera llamada de servicio', 'Atiende una llamada de principio a fin', 1),
  ('sim-3-2', 'mod-3-2', 'Resuelve un caso difícil', 'Maneja un cliente frustrado', 1),
  ('sim-3-3', 'mod-3-3', 'Turno completo en un call center', 'Vive un turno simulado completo', 1),
  ('sim-r1', 'mod-1-3', 'Escenario completo: Conseguir trabajo', 'Integra todo lo aprendido en la Ruta 1', 2),
  ('sim-r2', 'mod-2-3', 'Escenario completo: Entrevista', 'Integra todo lo aprendido en la Ruta 2', 2),
  ('sim-r3', 'mod-3-3', 'Escenario completo: Call center', 'Integra todo lo aprendido en la Ruta 3', 2);
```

### Admin user

```sql
-- After registering the admin user through the app, run this:
-- UPDATE public.profiles SET is_admin = true WHERE email = 'ADMIN_EMAIL_HERE';
```
