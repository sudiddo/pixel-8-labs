# Github Workflows Naming Format

```
<folder>.<action>.yml
```

## Actions Index

| Action     | Event                    | Description                                                           |
| ---------- | ------------------------ | --------------------------------------------------------------------- |
| Lint       | Push & Pull Request Open | Checks and enforce code style and formatting                          |
| Test       | Push & Pull Request Open | Runs automated tests to verify changes                                |
| Preview    | Push & Pull Request Open | Frontend - Create a preview and display it on PR for easier PR review |
| Staging    | Merge to Master          | Build and deploy to long lived staging server                         |
| Production | Release Tag Created      | Release to Production                                                 |