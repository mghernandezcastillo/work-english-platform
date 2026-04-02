# ============================================================
# English for Work — Generador de Audio con ElevenLabs
# Llama la Edge Function generate-audio para cada leccion y simulacion
# ============================================================

$EdgeFunction = "https://mtobgwfknefjlpoxznqx.supabase.co/functions/v1/generate-audio"

# Tres cuentas ElevenLabs — rotamos para no agotar ninguna
$ApiKeys = @(
    "8f7220dd635680066a130e2a110917239e98549f810c8ea132ed46d76925e5b9",   # mghernandezcastillo@gmail.com  — 7,232 creditos
    "e3b29b520ee2c1a65d5544b3f7ec1312e4b96ff4314c3393ff9d575b1207bb1f",   # michercasmoto@gmail.com        — 6,416 creditos
    "c7aa6549fed01b2b674d8c9a6c658c5965de617c18c2fe0c784a259dc5a72705"    # marcela.drs2012@gmail.com      — 10,000 creditos
)

# Todas las lecciones
$Lessons = @(
    "les-1-1-1","les-1-1-2","les-1-1-3","les-1-1-4",
    "les-1-2-1","les-1-2-2","les-1-2-3","les-1-2-4",
    "les-1-3-1","les-1-3-2","les-1-3-3","les-1-3-4",
    "les-2-1-1","les-2-1-2","les-2-1-3","les-2-1-4",
    "les-2-2-1","les-2-2-2","les-2-2-3","les-2-2-4",
    "les-2-3-1","les-2-3-2","les-2-3-3","les-2-3-4",
    "les-3-1-1","les-3-1-2","les-3-1-3","les-3-1-4",
    "les-3-2-1","les-3-2-2","les-3-2-3","les-3-2-4",
    "les-3-3-1","les-3-3-2","les-3-3-3","les-3-3-4"
)

# Todas las simulaciones
$Sims = @(
    "sim-1-1","sim-1-2","sim-1-3",
    "sim-2-1","sim-2-2","sim-2-3",
    "sim-3-1","sim-3-2","sim-3-3",
    "sim-r1","sim-r2","sim-r3"
)

$KeyIndex = 0
$TotalGenerated = 0
$TotalSkipped = 0
$TotalErrors = 0

function Invoke-AudioGeneration {
    param (
        [string]$ItemId,
        [string]$Type  # "lesson" or "sim"
    )

    $ApiKey = $ApiKeys[$script:KeyIndex % 3]

    $Body = if ($Type -eq "lesson") {
        @{ lessonId = $ItemId; elevenLabsApiKey = $ApiKey } | ConvertTo-Json
    } else {
        @{ simId = $ItemId; elevenLabsApiKey = $ApiKey } | ConvertTo-Json
    }

    Write-Host "[$Type] $ItemId — usando cuenta $($script:KeyIndex % 3 + 1)..." -NoNewline

    try {
        $Response = Invoke-RestMethod `
            -Method POST `
            -Uri $EdgeFunction `
            -ContentType "application/json" `
            -Body $Body `
            -TimeoutSec 120

        $g = $Response.generated
        $s = $Response.skipped
        $e = $Response.errors

        $script:TotalGenerated += $g
        $script:TotalSkipped   += $s
        $script:TotalErrors    += $e
        $script:KeyIndex++

        if ($e -gt 0) {
            Write-Host " ✅ Gen: $g | Skip: $s | ⚠️ Err: $e" -ForegroundColor Yellow
        } else {
            Write-Host " ✅ Gen: $g | Skip: $s" -ForegroundColor Green
        }

    } catch {
        Write-Host " ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $script:TotalErrors++
        Start-Sleep -Seconds 5
    }

    # Pausa breve entre llamadas para no saturar la API
    Start-Sleep -Milliseconds 500
}

# ============================================================
Write-Host ""
Write-Host "🎙️  GENERANDO AUDIO — English for Work" -ForegroundColor Cyan
Write-Host "============================================================"
Write-Host ""

# Procesar lecciones
Write-Host "📚 LECCIONES (36)" -ForegroundColor Cyan
foreach ($id in $Lessons) {
    Invoke-AudioGeneration -ItemId $id -Type "lesson"
}

Write-Host ""
Write-Host "🎭 SIMULACIONES (12)" -ForegroundColor Cyan
foreach ($id in $Sims) {
    Invoke-AudioGeneration -ItemId $id -Type "sim"
}

# ============================================================
Write-Host ""
Write-Host "============================================================"
Write-Host "✅ COMPLETADO" -ForegroundColor Green
Write-Host "   Generados : $TotalGenerated clips nuevos"
Write-Host "   Existentes: $TotalSkipped clips (ya tenian audio)"
Write-Host "   Errores   : $TotalErrors"
Write-Host ""
Write-Host "Revisa la plataforma en: https://work-english-platform.vercel.app"
