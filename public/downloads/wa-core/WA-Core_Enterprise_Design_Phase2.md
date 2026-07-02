# WA-Core Enterprise Agent: Phase 2 - Advanced PowerShell Modules with Async/Parallel Processing

## 1. Introduction

This document details the development of advanced PowerShell modules for the WA-Core agent, focusing on implementing parallel processing and asynchronous operations. These capabilities are crucial for enhancing the agent's performance, responsiveness, and ability to handle complex, concurrent tasks efficiently. The design adheres to the architectural principles established in Phase 1, emphasizing modularity, resilience, and observability.

## 2. Core Module (`WA-Core.psm1`) Enhancements

The `WA-Core.psm1` module will be significantly enhanced to include functions and cmdlets that leverage PowerShell's advanced execution capabilities. The module will provide a standardized way to perform parallel and asynchronous tasks, abstracting the underlying complexity from the consuming scripts.

### 2.1. `Invoke-WACoreTask` Cmdlet for Parallel/Async Execution

A central cmdlet, `Invoke-WACoreTask`, will be introduced to manage parallel and asynchronous execution of scripts or script blocks. This cmdlet will provide a flexible interface for users to define tasks and specify their execution model.

#### `Invoke-WACoreTask` Parameters:

| Parameter | Type | Description | Required | Default | Notes |
|---|---|---|---|---|---|
| `ScriptBlock` | `ScriptBlock` | The PowerShell script block to execute. | Yes | N/A | The core logic to be run. |
| `ArgumentList` | `Array` | Arguments to pass to the `ScriptBlock`. | No | N/A | Allows passing multiple arguments. |
| `AsJob` | `Switch` | Executes the `ScriptBlock` as a background job. | No | `False` | Uses `Start-Job` for process isolation. |
| `Parallel` | `Switch` | Executes the `ScriptBlock` in parallel across multiple items. | No | `False` | Requires `InputObject` for collection processing. |
| `InputObject` | `PSObject[]` | Collection of objects to process in parallel. | No | N/A | Used with `-Parallel`. |
| `ThrottleLimit` | `Int` | Maximum number of parallel tasks/jobs. | No | `5` | Controls resource consumption. |
| `Asynchronous` | `Switch` | Executes the `ScriptBlock` asynchronously (PowerShell 7+). | No | `False` | Uses `Start-ThreadJob` or `async/await` patterns. |
| `ErrorAction` | `ActionPreference` | Specifies how the cmdlet responds to a non-terminating error. | No | `Continue` | Standard PowerShell error handling. |
| `ErrorVariable` | `String` | Stores error objects in the specified variable. | No | N/A | For custom error handling. |

#### Example Usage:

```powershell
# Example 1: Run a simple script block as a background job
Invoke-WACoreTask -ScriptBlock { Get-Process | Select-Object -First 5 } -AsJob

# Example 2: Process a collection in parallel
$servers = "Server1", "Server2", "Server3"
Invoke-WACoreTask -ScriptBlock { param($server) Test-Connection -ComputerName $server -Count 1 } -InputObject $servers -Parallel -ThrottleLimit 2

# Example 3: Asynchronous operation (PowerShell 7+)
Invoke-WACoreTask -ScriptBlock {
    param($url)
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    return $response.StatusCode
} -ArgumentList @("https://www.google.com") -Asynchronous
```

### 2.2. Modern Error Handling Integration

All cmdlets within `WA-Core.psm1`, especially `Invoke-WACoreTask`, will incorporate modern error handling patterns:

*   **Custom Error Records**: When an error occurs, a detailed error record will be generated, including `ErrorId`, `TargetObject`, `CategoryInfo`, and `Exception` details. This allows for precise error identification and programmatic handling.
*   **Centralized Error Logging**: Errors will be automatically routed to the telemetry and diagnostics framework (Phase 4) for structured logging and analysis.
*   **Graceful Degradation**: Non-critical failures will be handled to allow the agent to continue operation, while critical errors will trigger appropriate alerts and recovery mechanisms.

### 2.3. Module Structure for Advanced Features

To maintain modularity and readability, the `WA-Core.psm1` will be structured to include helper functions and private functions for managing parallel and asynchronous execution.

```powershell
# WA-Core Module - Advanced Features

# Private helper functions for job management
function _Start-WACoreJob { ... }
function _Wait-WACoreJob { ... }
function _Get-WACoreJobResult { ... }

# Private helper functions for parallel processing
function _Invoke-WACoreParallel { ... }

# Private helper functions for asynchronous operations (PS 7+)
function _Invoke-WACoreAsync { ... }

# Public Cmdlet
function Invoke-WACoreTask { ... }

# ... other WA-Core functions (Start-WACore, Stop-WACore, etc.)

Export-ModuleMember -Function @(
    'Invoke-WACoreTask',
    # ... other public functions
)
```

## 3. Implementation Details for Parallel/Async

### 3.1. `Invoke-WACoreTask` Logic Flow

1.  **Parameter Validation**: Ensure `ScriptBlock` is provided and validate other parameters based on `AsJob`, `Parallel`, or `Asynchronous` switches.
2.  **Execution Strategy Selection**: Based on the provided switches, select the appropriate execution method:
    *   If `-AsJob` is present, use `Start-Job`.
    *   If `-Parallel` is present, use `ForEach-Object -Parallel` (or `Start-ThreadJob` for PowerShell 7+ if `Asynchronous` is also specified).
    *   If `-Asynchronous` is present (and PowerShell 7+), use `Start-ThreadJob` or `async/await` patterns.
    *   Otherwise, execute the `ScriptBlock` directly.
3.  **Error Handling**: Wrap execution logic in `try/catch` blocks. Capture errors and pass them to the centralized error logging system.
4.  **Result Aggregation**: For parallel and asynchronous tasks, collect and return results in a consistent format (e.g., an array of objects).

### 3.2. Considerations for PowerShell Versions

*   **PowerShell 5.1**: Primarily rely on `Start-Job` for background processing and `ForEach-Object` for basic iteration. True `async/await` is not available.
*   **PowerShell 7+ (Core)**: Leverage `Start-ThreadJob` for lightweight parallelism and explore `async/await` patterns for I/O-bound tasks to maximize responsiveness.

## 4. Next Steps

Phase 3 will focus on implementing the security, encryption, and audit systems, building upon the enhanced module capabilities developed in this phase. This includes integrating secrets management, Zero-Trust principles, and comprehensive audit logging mechanisms.
