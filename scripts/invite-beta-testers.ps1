# ================================================================
# scripts/invite-beta-testers.ps1
#
# Invita a beta testers: crea su cuenta, da acceso paid y les
# envía un magic link directo a su email.
#
# USO:
#   .\scripts\invite-beta-testers.ps1
#
# AGREGAR BETAS: edita la lista $betaTesters abajo
# ================================================================

$FUNCTION_URL = "https://mtobgwfknefjlpoxznqx.supabase.co/functions/v1/invite-beta-user"

# ── LISTA DE BETA TESTERS ──────────────────────────────────────
# Agrega o quita personas aquí. Format: email, nombre, notas
$betaTesters = @(
  # @{ email = "amigo1@gmail.com";    name = "Juan Pérez";   notes = "WhatsApp grupo 1" },
  # @{ email = "amiga2@hotmail.com";  name = "María López";  notes = "Referida por Miguel" },
  # @{ email = "contacto@work.com";   name = "Carlos Ruiz";  notes = "Colega oficina" },
  # Descomenta y llena con tus beta testers reales
)

# ── EJECUCIÓN ──────────────────────────────────────────────────
if ($betaTesters.Count -eq 0) {
  Write-Host "⚠️  No hay beta testers en la lista." -ForegroundColor Yellow
  Write-Host "   Edita scripts\invite-beta-testers.ps1 y agrega emails en `$betaTesters" -ForegroundColor Yellow
  exit 0
}

Write-Host ""
Write-Host "🚀  INVITANDO $($betaTesters.Count) BETA TESTERS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$success = 0
$errors  = 0

foreach ($tester in $betaTesters) {
  Write-Host "📧  $($tester.name) <$($tester.email)>... " -NoNewline

  $body = @{
    email = $tester.email
    name  = $tester.name
    notes = $tester.notes
  } | ConvertTo-Json

  try {
    $r = Invoke-RestMethod -Method POST -Uri $FUNCTION_URL -ContentType "application/json" -Body $body -TimeoutSec 30
    if ($r.success) {
      $new  = if ($r.isNew) { "nueva cuenta" } else { "cuenta existente" }
      $mail = if ($r.emailSent) { "✅ email enviado" } else { "⚠️  email falló" }
      Write-Host "$mail ($new)" -ForegroundColor Green
      $success++
    } else {
      Write-Host "❌ Error en función" -ForegroundColor Red
      $errors++
    }
  } catch {
    Write-Host "❌ $($_.Exception.Message)" -ForegroundColor Red
    $errors++
  }

  Start-Sleep -Milliseconds 800  # respetar rate limits de Brevo
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅  Exitosos : $success" -ForegroundColor Green
Write-Host "❌  Errores  : $errors"  -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "Gray" })
Write-Host ""
Write-Host "💡  Revisa el panel admin para ver los beta testers:" -ForegroundColor Yellow
Write-Host "    https://english-for-work.vercel.app/admin" -ForegroundColor Yellow
Write-Host ""
