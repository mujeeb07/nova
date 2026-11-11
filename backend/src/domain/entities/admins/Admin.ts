import { ROLE, PERMISSIONS } from "./IAdmin";
import { AppError } from "../../../utils/errors/AppError";

export interface AdminProps {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: ROLE;
    permissions: PERMISSIONS[];
    status: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Admin {
    private constructor(private props: AdminProps) {};
    // New admin: enforce creation invariants.
    static create(input: {
        id: string; name: string; email: string; passwordHash: string;
        role: ROLE; permissions?: PERMISSIONS[]; now?: Date; }): Admin {
            const now = input.now ?? new Date();
            if (!input.name.trim()) throw new AppError("Name is required", 400);
            if (!input.email.includes("@")) throw new AppError("Invalid email",400);

            return new Admin({
                id: input.id,
                name: input.name.trim(),
                email: input.email.toLowerCase(),
                passwordHash: input.passwordHash,
                role: input.role,
                permissions: input.role === ROLE.SUPER_ADMIN ? [] : [...new Set(input.permissions ?? [])],
                status: false,
                lastLoginAt: null,
                createdAt: now,
                updatedAt: now,
            });
    }

    // Rehydrate from DB: no creation rules, but validates data integrity.
    static reconstitute(props: AdminProps): Admin {
        if (!Object.values(ROLE).includes(props.role)) {
            throw new AppError("Forbidden: Admin account is in an invalid state or lacks required permissions", 403);
        }
        return new Admin({ ...props, permissions: [...props.permissions] });
    }

    // ---- Queries ----
    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get email() { return this.props.email; }
    get passwordHash() { return this.props.passwordHash; }
    get role() { return this.props.role; }
    get status() { return this.props.status; }
    get lastLoginAt() { return this.props.lastLoginAt; }
    get permissions(): readonly PERMISSIONS[] { return this.props.permissions; }

    isSuspended() { return this.props.status; }
    isSuperAdmin() { return this.props.role === ROLE.SUPER_ADMIN; }

    hasPermission(p: PERMISSIONS) {
        return this.isSuperAdmin() || this.props.permissions.includes(p);
    }

    // ---- Business rules / commands ----
    assertCanLogin(): void {
        if (this.isSuspended()) throw new AppError("Account is suspended/blocked. Contact support", 403);
    }

    recordLogin(now: Date = new Date()): void {
        this.assertCanLogin();
        this.props.lastLoginAt = now;
        this.props.updatedAt = now;
    }

    suspend(by: Admin, now = new Date()): void {
        if (!by.isSuperAdmin()) throw new AppError('Forbidden: Insufficient permissions.', 403);
        if (this.isSuperAdmin()) throw new AppError("Super admin cannot be suspended", 403);
        this.props.status = false;
        this.props.updatedAt = now;
    }

    activate(now = new Date()): void {
        this.props.status = true;
        this.props.updatedAt = now;
    }

    grantPermission(p: PERMISSIONS, now = new Date()): void {
        if (this.isSuperAdmin()) throw new AppError("Super admin has all permissions implicitly", 403);
        if (!this.props.permissions.includes(p)) {
            this.props.permissions.push(p);
            this.props.updatedAt = now;
        }
    }

    revokePermission(p: PERMISSIONS, now = new Date()): void {
        this.props.permissions = this.props.permissions.filter(x => x !== p);
        this.props.updatedAt = now;
    }

    changePasswordHash(newHash: string, now = new Date()): void {
        this.props.passwordHash = newHash;
        this.props.updatedAt = now;
    }
}