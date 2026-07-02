# WA-Core Zero-Trust IP Security Policy

**Version:** 1.0.0
**Date:** July 2, 2026

## 1. Local Code Ownership
WA-Core operates strictly on a 'Data-as-a-Shield' principle. All proprietary source code (IP) remains localized within the on-premises or private cloud boundary. 

## 2. Telemetry and LLM Encryption
Any context sent to external AI engines (such as OpenAI/Gemini) is stripped of sensitive IP and hashed using SHA-256 before transit. Data is encrypted in transit using TLS 1.3.

## 3. Autonomous Execution Guardrails
WA-Core requires explicit approval for destructive actions. It employs an Immutable Audit Log, meaning every filesystem or network change initiated by the agent is cryptographically signed and stored for compliance.
