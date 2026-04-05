import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { EditAdminDialog } from "@/components/admin/edit-admin-dialog";
import { createAdmin, deleteAdmin, updateAdmin } from "@/app/actions/admin-users";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
        redirect("/admin");
    }

    const admins = await prisma.adminUser.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-serif text-primary">Admin Users Management</h2>
                    <p className="text-sm text-muted-foreground">Manage system administrators and staff accounts.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Add New Administrator</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createAdmin} className="grid md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" name="email" placeholder="admin@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" name="password" placeholder="••••••••" minLength={6} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <select name="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                        </div>
                        <Button type="submit">Create User</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Existing Administrators</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell className="font-medium">{admin.name || "N/A"}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={admin.role === "SUPER_ADMIN" ? "default" : "outline"}>
                                            {admin.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {session.user.id !== admin.id ? (
                                            <div className="flex gap-2">
                                                <EditAdminDialog admin={admin} action={updateAdmin} />
                                                <DeleteButton action={deleteAdmin.bind(null, admin.id)} itemType="User" />
                                            </div>
                                        ) : (
                                            <Badge variant="secondary">Current User</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
