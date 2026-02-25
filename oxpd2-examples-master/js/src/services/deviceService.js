""''''TT"TT"bbbbb
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
E
m
a
i
l


 
 
 
 
 
 
 
 
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




 
 
 
 
 
 
 
 
l
e
t
 
d
c
 
=
 
n
e
w
 
D
e
v
i
c
e
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
.
D
e
v
i
c
e
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
 
d
t
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
 
e
m
a
i
l
 
=
 
a
w
a
i
t
 
d
c
.
e
m
a
i
l
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


 
 
 
 
 
 
 
 
/
/
 
@
E
n
d
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


 
 
 
 
 
 
 
 
r
e
t
u
r
n
 
e
m
a
i
l
;


 
 
 
 
}


 
 
 
 
 
a
s
y
n
c
 
g
e
t
E
m
a
i
l
2
(
)
 
{


`
`
`