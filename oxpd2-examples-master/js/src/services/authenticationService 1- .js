`
`
`
j
a
v
a
s
c
r
i
p
t


i
m
p
o
r
t
 
d
e
v
i
c
e
M
a
n
a
g
e
m
e
n
t
S
e
r
v
i
c
e
 
f
r
o
m
 
"
.
/
d
e
v
i
c
e
M
a
n
a
g
e
m
e
n
t
S
e
r
v
i
c
e
.
j
s
"
;


i
m
p
o
r
t
 
o
x
p
d
2
 
f
r
o
m
 
'
o
x
p
d
2
'
;




c
o
n
s
t
 
A
u
t
h
e
n
t
i
c
a
t
i
o
n
S
e
r
v
i
c
e
C
l
i
e
n
t
 
=
 
o
x
p
d
2
.
A
u
t
h
e
n
t
i
c
a
t
i
o
n
S
e
r
v
i
c
e
C
l
i
e
n
t
;


i
m
p
o
r
t
 
e
r
r
o
r
s
 
f
r
o
m
 
'
.
/
e
r
r
o
r
s
.
j
s
'
;


i
m
p
o
r
t
 
{
 
A
c
c
e
s
s
T
o
k
e
n
T
y
p
e
 
}
 
f
r
o
m
 
"
.
.
/
m
o
d
e
l
s
/
a
c
c
e
s
s
T
o
k
e
n
T
y
p
e
.
j
s
"
;




c
l
a
s
s
 
A
u
t
h
e
n
t
i
c
a
t
i
o
n
S
e
r
v
i
c
e
 
{




 
 
 
 
c
o
n
s
t
r
u
c
t
o
r
(
p
r
o
p
s
)
 
{




 
 
 
 
}




 
 
 
 
a
s
y
n
c
 
g
e
t
C
a
p
a
b
i
l
i
t
i
e
s
(
)
 
{


 
 
 
 
 
 
 
 
/
/
 
@
S
t
a
r
t
C
o
d
e
E
x
a
m
p
l
e
:
G
e
t
C
a
p
a
b
i
l
i
t
i
e
s


 
 
 
 
 
 
 
 
i
f
 
(
d
e
v
i
c
e
M
a
n
a
g
e
m
e
n
t
S
e
r
v
i
c
e
.
c
u
r
r
e
n
t
D
e
v
i
c
e
 
=
=
 
n
u
l
l
)
 
{


 
 
 
 
 
 
 
 
 
 
 
 
t
h
r
o
w
 
n
e
w
 
E
r
r
o
r
(
e
r
r
o
r
s
.
N
O
_
B
O
U
N
D
_
D
E
V
I
C
E
)
;


 
 
 
 
 
 
 
 
}


 
 
 
 
 
 
 
 
l
e
t
 
d
s
c
 
=
 
n
e
w
 
o
x
p
d
2
.
D
i
s
c
o
v
e
r
y
S
e
r
v
i
c
e
C
l
i
e
n
t
(
d
e
v
i
c
e
M
a
n
a
g
e
m
e
n
t
S
e
r
v
i
c
e
.
c
u
r
r
e
n
t
D
e
v
i
c
e
.
n
e
t
w
o
r
k
A
d
d
r
e
s
s
,
 
f
e
t
c
h
)
;


 
 
 
 
 
 
 
 
l
e
t
 
d
t
 
=
 
a
w
a
i
t
 
d
s
c
.
s
e
r
v
i
c
e
s
D
i
s
c
o
v
e
r
y
G
e
t
A
s
y
n
c
(
)
;


`
`
`