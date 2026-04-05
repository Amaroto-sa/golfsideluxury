"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createAdmin(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const hashedPassword = await hash(password, 10);

    await prisma.adminUser.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || "ADMIN",
        },
    });

    revalidatePath("/admin/users");
}

export async function updateAdmin(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const dataToUpdate: any = { name, email, role };
    if (password && password.trim() !== "") {
        dataToUpdate.password = await hash(password, 10);
    }

    await prisma.adminUser.update({
        where: { id },
        data: dataToUpdate,
    });

    revalidatePath("/admin/users");
}

export async function deleteAdmin(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized");
    }

    await prisma.adminUser.delete({
        where: { id },
    });

    revalidatePath("/admin/users");
}

export async function updateProfile(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password && password.trim() !== "") {
        dataToUpdate.password = await hash(password, 10);
    }

    if (Object.keys(dataToUpdate).length > 0) {
        await prisma.adminUser.update({
            where: { id: session.user.id },
            data: dataToUpdate,
        });
    }

    revalidatePath("/admin/profile");
}
