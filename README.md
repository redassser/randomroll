# Randomroll

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

I left that in because, I mean, it's true. I did do that.

## It came to me in a dream
A day dream, specifically during class. rdroll.com

Imagine an easy to access webapp that could execute complex functions that involved common dice terminology (like 1d6 and 8d20). 

One such function, and will be the benchmark for whether my parser is functional: 
`(3*(6d13+22)-9)/i[1,4}`

Now google has a dice thingy, if you type a simple expression with a dice roll and maybe one addition (like 2d8 + 3) it'll pop up, but that's it. Very limited, but its very easy to use and quite cool looking. 

Another is rolladie.net. Similar but even clunkier than the google one. Just kinda worse. I'm not a fan, but it has another aspect that I want, which is multiple iterations of the roll shown at once.

dice.clockworkmod.com has you enter the dice function using text instead of annoying buttons and menus and submenus, which I like because its just faster and sometimes easier to understand than dice graphics, especially as the dice combinations increase in complexity. It also saves the function in a cookie so it doesn't go away, which is another thing I like.

No matter where I looked though, nobody would take my funny little function, even if it was just a dice roll and multiplication. So here I am, *making* it. What a world, eh?

## How it works / will work

First are the 

### operations and tokens (better name currently in development)

- `+` adds the values to the left and right. But you knew that.

- `-` subtracts the right value from the left, or negates the right value if there is no left value. 

- `/ and //` division where / gives you an integer rounded, // gives you an exact float.

- `*` you get it

- `<# of dice>d<# of sides>` generates a random number inclusive between 1 and <# of sides> a total of <# of dice> times. 

- `( )` should work as you know it does.

- `<i or f, optional><{ or [> <min number> , <max number> <] or }>` generates a random number between min and max, \{ is exclusive, \[ is inclusive. f in front means float, i means integer (i is default).

### examples

`2d17 + 5 / 8` 

`1d8 is equivalent to i[1,8]`