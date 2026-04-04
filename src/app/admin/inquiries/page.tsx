import React from "react";
import prisma from "@/lib/prisma";
import { updateInquiryStatus, deleteInquiry } from "@/app/actions/inquiries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
    let inquiries: any[] = [];
    try {
        inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch { }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-primary">Inquiry Management</h2>

            <Card>
                <CardContent className="p-0">
                    {inquiries.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inquiries.map((inq) => (
                                    <TableRow key={inq.id}>
                                        <TableCell className="font-medium">{inq.name}</TableCell>
                                        <TableCell className="text-sm">{inq.email}</TableCell>
                                        <TableCell className="text-sm">{inq.phone || "—"}</TableCell>
                                        <TableCell className="max-w-xs">
                                            <p className="text-sm text-muted-foreground line-clamp-2">{inq.message}</p>
                                        </TableCell>
                                        <TableCell className="text-sm">{new Date(inq.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                inq.status === "NEW" ? "warning" :
                                                    inq.status === "READ" ? "secondary" : "success"
                                            }>
                                                {inq.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {inq.status === "NEW" && (
                                                    <form action={async () => { "use server"; await updateInquiryStatus(inq.id, "READ"); }}>
                                                        <Button size="sm" variant="outline" type="submit">Mark Read</Button>
                                                    </form>
                                                )}
                                                {inq.status !== "RESOLVED" && (
                                                    <form action={async () => { "use server"; await updateInquiryStatus(inq.id, "RESOLVED"); }}>
                                                        <Button size="sm" variant="default" type="submit">Resolve</Button>
                                                    </form>
                                                )}
                                                <DeleteButton action={deleteInquiry.bind(null, inq.id)} itemType="Inquiry" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">No inquiries received yet.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
