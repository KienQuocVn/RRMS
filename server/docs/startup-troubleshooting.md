# Backend startup troubleshooting

If Spring Boot fails with an error like:

```text
Parameter N of constructor ... required a bean of type
'com.rrms.rrms.mapper.AccountMapper' that could not be found
```

the usual cause is that MapStruct did not generate `AccountMapperImpl` before the app started.

## Why this happens

`AccountMapper` is only an interface. Spring can inject it only after MapStruct generates
`AccountMapperImpl` during compilation.

When the backend is started directly from the IDE, annotation processing may be skipped.
That leaves Spring with `AccountMapper.class` but without `AccountMapperImpl.class`, so startup fails.

## Stable way to run the backend

Use one of these commands from the `server` folder:

```powershell
.\run-dev.ps1
```

or:

```powershell
.\mvnw.cmd -Dmaven.test.skip=true spring-boot:run -Dspring-boot.run.profiles=dev
```

These commands still compile the main source set so MapStruct and Lombok run before Spring Boot starts,
but they skip broken legacy test compilation.

## If you still want to run from the IDE

Make sure the IDE has annotation processing enabled for Maven projects. If that setting is off,
MapStruct mappers can disappear again after a restart or after cleaning the project.

This repository now includes IntelliJ's `.idea/compiler.xml` with annotation processing enabled.
If you already opened the project before that file was added, re-import the Maven project or restart
the IDE once so IntelliJ picks up the new compiler setting.

## If you open the monorepo from the workspace root

The backend Maven project lives in `server/pom.xml`, not at the repository root.

If IntelliJ opens `D:\RRMS` as a plain project without importing `server/pom.xml`, Spring Boot can
start from stale classes and miss generated mapper beans such as `AccountMapperImpl`.

This repository now includes root-level IntelliJ metadata that points the workspace to
`server/pom.xml`, but if your IDE cached an older project model you should:

1. Re-import the Maven project from `server/pom.xml`.
2. Restart IntelliJ once.
3. Run the backend again after Maven finishes compiling generated sources.
