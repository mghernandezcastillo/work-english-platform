# Pedagogical Framework — English for Work

> Source: `00-master-prd.md` Section 9

---

## Core educational philosophy

**We don't teach English. We teach people how to use English at work.**

This means:
- Every phrase exists because a real job requires it
- Every exercise simulates a real work situation
- Every explanation addresses a real communication need
- Grammar is never taught in isolation — only as part of functional communication

---

## The 7-step lesson structure

Every lesson follows this exact sequence. No exceptions.

### Step 1: Objetivo Práctico
- **Language:** Spanish
- **Length:** 1 sentence
- **Format:** "Después de esta lección vas a poder [specific action]."
- **Purpose:** Set clear expectation; learner knows exactly what they'll gain
- **Design rule:** Always visible at the top of the lesson, with distinct visual treatment

### Step 2: Frases Clave / Vocabulario
- **Language:** English + Spanish translation
- **Count:** 6-8 phrases per lesson
- **Format per phrase:**
  - English phrase (large text)
  - Spanish translation (smaller text below)
  - Pronunciation guide (phonetic using Spanish sounds)
  - Context note (Spanish — when/how to use this phrase)
  - Audio play button
- **Design rule:** Card-style layout, one phrase per card, swipeable on mobile

### Step 3: Mini-Ejemplo Real
- **Language:** English (primary), with optional Spanish context
- **Format:** Short dialogue (2-4 exchanges) or email/message
- **Audio:** Full dialogue with multi-speaker audio
- **Purpose:** Show phrases in realistic context
- **Design rule:** Chat-bubble or email format, visually distinct from lesson text

### Step 4: Explicación Corta
- **Language:** Spanish
- **Length:** 3-5 sentences maximum
- **Content:** Key patterns, usage tips, common mistakes
- **Tone:** Conversational, not academic — like a friend explaining
- **Design rule:** Subtle background, clear typography, no jargon

### Step 5: Ejercicio
- **Language:** Instructions in Spanish, content in English
- **Count:** 1-2 per lesson
- **Types:**

| Type | Description | Example |
|---|---|---|
| `fill-blank` | Complete the sentence with the correct word | "I have ___ years of experience in ___." |
| `match` | Match English phrases to Spanish meanings | Drag-and-drop or tap-to-match |
| `reorder` | Put words in correct order to form a sentence | Drag words into correct sequence |
| `choose` | Select the correct response for a situation | Multiple choice with scenario context |

- **Feedback:** Immediate — correct answer + explanation
- **Design rule:** Interactive, gamified feel, clear success/error states

### Step 6: Práctica Guiada
- **Language:** English responses, Spanish scaffolding/scenarios
- **Format:** Step-by-step guided scenario
- **Scaffolding:** User sees a work situation → selects best response → gets feedback
- **Progression:** 3-4 steps per practice, building to more complex responses
- **Design rule:** Conversational flow, clear "you are here" indicator

### Step 7: Refuerzo / Cierre
- **Language:** Spanish summary + English key phrases
- **Content:**
  - Quick summary of what was learned (2-3 sentences)
  - List of key phrases to remember
  - Preview of next lesson
  - Motivational close
- **Additional trigger:** If this completes a module → show testimonial prompt
- **Design rule:** Celebratory feel, clear "lesson complete" visual, progress update

---

## Simulation structure

Simulations are longer, multi-turn interactive scenarios that appear at the end of each module (one per module = 9 total, plus 3 route-level = 12 total).

### Simulation format

```
Simulation
├── Introduction (Spanish — sets the scene)
├── Turn 1
│   ├── Audio: Other speaker says something
│   ├── User sees 3 response options
│   ├── User selects one
│   ├── Feedback (correct/incorrect + explanation)
│   └── Conversation continues
├── Turn 2-8 (same pattern)
├── Summary
│   ├── Score (X/Y correct)
│   ├── All phrases used
│   ├── Suggested review areas
│   └── Testimonial prompt (if completing module/route)
```

### Simulation specs

| Attribute | Value |
|---|---|
| Turns per simulation | 6-10 |
| Speakers | 2-3 (named characters) |
| Response options per turn | 2-3 |
| Audio | Multi-speaker, full dialogue |
| Duration | 5-8 minutes |
| Scoring | Correct responses / total turns |
| Retry | Users can redo simulations |

---

## Exercise type specifications

### Fill-blank
```json
{
  "type": "fill-blank",
  "instruction": "Completa la frase:",
  "sentence": "I would be happy to ___ you with that.",
  "blanks": ["help"],
  "acceptAlternatives": ["assist"],
  "feedback": {
    "correct": "¡Correcto! 'I would be happy to help you with that.' es una de las frases más usadas en servicio al cliente.",
    "incorrect": "La respuesta correcta es 'help'. Recuerda: 'I would be happy to help you with that.'"
  }
}
```

### Match
```json
{
  "type": "match",
  "instruction": "Conecta cada frase con su significado:",
  "pairs": [
    { "english": "I'd be happy to help.", "spanish": "Con gusto le ayudo." },
    { "english": "Let me look into that.", "spanish": "Déjeme revisar eso." },
    { "english": "Is there anything else?", "spanish": "¿Hay algo más en lo que pueda ayudarle?" }
  ]
}
```

### Reorder
```json
{
  "type": "reorder",
  "instruction": "Ordena las palabras para formar la frase correcta:",
  "words": ["happy", "help", "to", "I'd", "be", "you"],
  "correctOrder": ["I'd", "be", "happy", "to", "help", "you"],
  "feedback": {
    "correct": "¡Perfecto! 'I'd be happy to help you.'",
    "incorrect": "El orden correcto es: 'I'd be happy to help you.'"
  }
}
```

### Choose
```json
{
  "type": "choose",
  "instruction": "Un cliente dice: 'I'm having trouble with my order.' ¿Cuál es la mejor respuesta?",
  "options": [
    { "text": "I'm sorry to hear that. Let me help you with that.", "correct": true },
    { "text": "That's not my problem.", "correct": false },
    { "text": "Can you repeat that?", "correct": false }
  ],
  "feedback": {
    "correct": "¡Excelente! Mostrar empatía y ofrecer ayuda es la respuesta profesional.",
    "incorrect": "En servicio al cliente, siempre empieza con empatía: 'I'm sorry to hear that.'"
  }
}
```

---

## Pedagogical principles

| Principle | How it manifests |
|---|---|
| **Relevance first** | Every phrase comes from real workplace contexts — HR, interviews, call centers |
| **Comprehensible input** | English content is slightly above learner's level, with Spanish support |
| **Scaffolded production** | Guided practice provides options before expecting free production |
| **Immediate feedback** | Every exercise and simulation turn gives instant correction |
| **Spaced exposure** | Key phrases reappear across lessons and simulations |
| **Confidence through repetition** | Simulations let users practice the same scenarios until comfortable |
| **Completion momentum** | Short lessons (8-15 min) create a habit of finishing |
| **Emotional safety** | Spanish explanations ensure learners never feel lost |

---

## Estimated time per lesson component

| Step | Estimated time |
|---|---|
| 1. Objective | 15 seconds |
| 2. Phrases (6-8) | 3-4 minutes |
| 3. Mini-example | 1-2 minutes |
| 4. Explanation | 1 minute |
| 5. Exercise(s) | 2-3 minutes |
| 6. Guided practice | 2-3 minutes |
| 7. Reinforcement | 30 seconds |
| **Total per lesson** | **8-15 minutes** |

---

## Progression model

```
Lesson 1 → Lesson 2 → Lesson 3 → Lesson 4 → Module Simulation
         (builds on)  (builds on)  (applies all)  (tests all)
```

- Lessons within a module are sequential — each builds on the previous
- Simulations integrate all phrases from the module
- Routes are independent — users can start with any route
- No strict prerequisite enforcement (to avoid frustration), but recommended order shown
