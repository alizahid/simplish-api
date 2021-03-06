# Migration `20201009052812-snippets-added`

This migration has been generated by Ali Zahid at 10/9/2020, 10:28:12 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Snippet" (
"id" SERIAL,
"name" text   NOT NULL ,
"language" text   NOT NULL ,
"content" text   NOT NULL ,
"tags" text []  ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."_SnippetToUser" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL
)

CREATE UNIQUE INDEX "_SnippetToUser_AB_unique" ON "public"."_SnippetToUser"("A", "B")

CREATE INDEX "_SnippetToUser_B_index" ON "public"."_SnippetToUser"("B")

ALTER TABLE "public"."_SnippetToUser" ADD FOREIGN KEY ("A")REFERENCES "public"."Snippet"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_SnippetToUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201005041812-initial..20201009052812-snippets-added
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -23,8 +23,9 @@
   boards   Board[]
   comments Comment[]
   items    Item[]
   lists    List[]
+  snippets Snippet[]
 }
 model List {
   id Int @id @default(autoincrement())
@@ -87,4 +88,18 @@
   lists List[]
   users User[]
 }
+
+model Snippet {
+  id Int @id @default(autoincrement())
+
+  name     String
+  language String
+  content  String
+  tags     String[]
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  users User[]
+}
```
