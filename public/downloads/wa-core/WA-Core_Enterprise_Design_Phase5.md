# WA-Core Enterprise Agent: Phase 5 - Interactive Configuration System with PSReadLine

## 1. Introduction

This document details the design and implementation of an interactive configuration system for the WA-Core PowerShell agent, leveraging PSReadLine. The goal is to provide a user-friendly, guided experience for setting up and modifying WA-Core settings, including sensitive information, while integrating with the robust error handling, security, and telemetry frameworks established in previous phases. This system aims to simplify agent deployment and management for administrators.

## 2. PSReadLine Integration Principles

The interactive configuration system will adhere to the following principles:

*   **User-Friendliness**: Provide clear, concise prompts and guidance throughout the configuration process.
*   **Context-Awareness**: Offer intelligent suggestions and default values based on the current environment and existing configuration.
*   **Validation**: Implement real-time input validation to prevent misconfigurations and provide immediate feedback.
*   **Security**: Securely handle sensitive input, such as API keys and passwords, by masking input and integrating with the secrets management system.
*   **Auditability**: Log all configuration changes through the audit logging framework.

## 3. `Configure-WACoreInteractive` Cmdlet

A new cmdlet, `Configure-WACoreInteractive`, will be the primary entry point for the interactive configuration experience. This cmdlet will guide the user through a series of prompts to set up WA-Core.

### 3.1. Cmdlet Overview

`Configure-WACoreInteractive` will orchestrate the interactive process, calling helper functions for specific configuration sections (e.g., `Configure-WACoreFeatures`, `Configure-WACoreTelemetry`). It will leverage PSReadLine for enhanced input capabilities.

### 3.2. PSReadLine Features Utilized

*   **Custom Key Handlers**: To enable specific actions like navigating through options, confirming choices, or providing help.
*   **Tab Completion**: For suggesting valid values (e.g., available features, log levels, secrets backends).
*   **History**: To allow users to recall previous inputs.
*   **Input Masking**: For sensitive data entry, preventing credentials from being displayed on screen.
*   **Colors and Formatting**: To visually distinguish prompts, input, and feedback.

### 3.3. Interactive Configuration Flow

The interactive flow will guide the user through the following key areas:

1.  **Welcome and Overview**: Explain the purpose of the configuration and provide options (e.g., initial setup, modify existing).
2.  **Installation Path Confirmation**: Confirm or set the WA-Core installation directory.
3.  **Feature Configuration**: Enable/disable core WA-Core features (Code Orchestration, Communication Triage, ROI Filtering).
4.  **Secrets Management Setup**: 
    *   Prompt for preferred secrets backend (Windows Credential Manager, Azure Key Vault, etc.).
    *   Collect necessary credentials/configuration for the chosen backend.
    *   Securely store initial secrets using `Set-WACoreSecret`.
5.  **Telemetry and Logging Setup**: 
    *   Prompt for desired log level (Debug, Info, Warn, Error, Critical).
    *   Configure telemetry destination (local file, SIEM endpoint, cloud service).
    *   Collect necessary API keys or connection strings for remote telemetry, using input masking.
6.  **Audit Logging Configuration**: Confirm audit log retention policies and integration with SIEM.
7.  **Summary and Confirmation**: Display a summary of all configured settings and prompt for final confirmation before applying changes.

## 4. Implementation Details

### 4.1. `Prompt-WACoreInput` Helper Function

A generic helper function, `Prompt-WACoreInput`, will be created to standardize interactive input, incorporating PSReadLine features.

#### `Prompt-WACoreInput` Parameters:

| Parameter | Type | Description | Required | Notes |
|---|---|---|---|---|
| `Message` | `String` | The prompt message to display to the user. | Yes | |
| `DefaultValue` | `String` | The default value to pre-fill. | No | |
| `ValidateScript` | `ScriptBlock` | A script block for input validation. | No | Returns `$true` for valid, `$false` for invalid. |
| `MaskInput` | `Switch` | If present, masks the input (e.g., for passwords). | No | |
| `Choices` | `String[]` | An array of valid choices for the user. | No | Enables tab completion for choices. |

#### Example Usage:

```powershell
# Prompt for a feature with validation and default
$enableCodeOrchestration = Prompt-WACoreInput -Message "Enable Code Orchestration? (Y/N)" -DefaultValue "Y" -ValidateScript { $_ -match "^[YNyn]$" }

# Prompt for a secret with masking
$apiKey = Prompt-WACoreInput -Message "Enter API Key:" -MaskInput

# Prompt with choices and tab completion
$logLevel = Prompt-WACoreInput -Message "Select log level:" -Choices @("Debug", "Info", "Warn", "Error", "Critical")
```

### 4.2. Integration with Secrets Management

When prompting for sensitive information (e.g., API keys, passwords), `Prompt-WACoreInput` will use the `-MaskInput` switch. The collected secrets will then be passed to `Set-WACoreSecret` for secure storage, ensuring they are never stored in plain text.

### 4.3. Integration with Telemetry and Audit Logging

*   **Telemetry**: The interactive configuration process itself will emit telemetry events (e.g., `ConfigurationStarted`, `ConfigurationCompleted`, `ConfigurationFailed`) to track setup progress and identify common pain points.
*   **Audit Logging**: Every significant configuration change made through `Configure-WACoreInteractive` will be logged using `Write-WACoreAuditLog`. This includes which settings were changed, by whom (if identifiable), and the old/new values (where appropriate and secure).

### 4.4. Error Handling

Robust error handling will be built into `Configure-WACoreInteractive` and its helper functions. Invalid input will trigger user-friendly error messages, and critical failures during configuration will be logged and reported, preventing the agent from entering an unrecoverable state.

## 5. Next Steps

Phase 6 will involve compiling all developed modules and scripts into a complete enterprise WA-Core package, including the enhanced bootstrap installer, comprehensive documentation, and a quick-start guide. This will mark the final delivery of the enterprise-grade WA-Core agent.
