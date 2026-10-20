export const QR_LABEL = { UNACTIVATED: "Belum Aktif", ACTIVE: "Aktif", DISABLED: "Dinonaktifkan", ARCHIVED: "Diarsipkan" } as const;
export const MAX_PIN_ATTEMPTS = 5;
export type QrStatusKey = keyof typeof QR_LABEL;
